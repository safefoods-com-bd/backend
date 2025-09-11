import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import {
  ordersTable,
  orderHistoryTable,
  productsTable,
  addressesTable,
} from "@/db/schema";
import { getUserOrdersValidationSchema } from "../orders.validation";
import { eq, desc, count, and, inArray } from "drizzle-orm";
import { ORDER_ENDPOINTS } from "@/data/endpoints";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import productOrdersTable from "@/db/schema/order-management/products_orders";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import variantProductsMediaTables from "@/db/schema/product-management/products/variant_products_media";
import mediaTables from "@/db/schema/utils/media";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";

/**
 * Retrieves all orders for a specific user with pagination, including order history for each order
 * @param req Express request object containing the user ID in params
 * @param res Express response object
 * @returns JSON response with the user's orders, their history, or error message
 */
export const getUserOrdersV100 = async (req: Request, res: Response) => {
  try {
    // Validate and parse user ID from params
    const validation = getUserOrdersValidationSchema.safeParse(req.params);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
        endpoint: ORDER_ENDPOINTS.GET_USER_ORDERS,
      };
    }

    const { userId } = validation.data;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";

    // Fetch orders
    const ordersQuery = db
      .select({
        id: ordersTable.id,
        userId: ordersTable.userId,
        subTotal: ordersTable.subTotal,
        discount: ordersTable.discount,
        couponId: ordersTable.couponId,
        afterDiscountTotal: ordersTable.afterDiscountTotal,
        deliveryCharge: ordersTable.deliveryCharge,
        deliveryZoneId: ordersTable.deliveryZoneId,
        total: ordersTable.total,
        preferredDeliveryDateAndTime: ordersTable.preferredDeliveryDateAndTime,
        paymentMethodId: ordersTable.paymentMethodId,
        paymentMethodTitle: paymentMethodTable.title,
        transactionNo: ordersTable.transactionNo,
        transactionPhoneNo: ordersTable.transactionPhoneNo,
        transactionDate: ordersTable.transactionDate,
        addressId: ordersTable.addressId,
        paymentStatus: ordersTable.paymentStatus,
        orderStatus: ordersTable.orderStatus,
        isDeleted: ordersTable.isDeleted,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
        address: {
          id: addressesTable.id,
          flatNo: addressesTable.flatNo,
          floorNo: addressesTable.floorNo,
          addressLine: addressesTable.addressLine,
          name: addressesTable.name,
          phoneNo: addressesTable.phoneNo,
          deliveryNotes: addressesTable.deliveryNotes,
          city: addressesTable.city,
          state: addressesTable.state,
          country: addressesTable.country,
          postalCode: addressesTable.postalCode,
          createdAt: addressesTable.createdAt,
          updatedAt: addressesTable.updatedAt,
          isActive: addressesTable.isActive,
        },
      })
      .from(ordersTable)
      .leftJoin(addressesTable, eq(ordersTable.addressId, addressesTable.id))
      .leftJoin(
        paymentMethodTable,
        eq(ordersTable.paymentMethodId, paymentMethodTable.id),
      )
      .where(
        and(eq(ordersTable.userId, userId), eq(ordersTable.isDeleted, false)),
      )
      .orderBy(
        sort === "desc" ? desc(ordersTable.createdAt) : ordersTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const orders = await ordersQuery;

    // Fetch order history for all orders in the result set
    const orderIds = orders.map((order) => order.id);
    const orderHistory =
      orderIds.length > 0
        ? await db
            .select({
              id: orderHistoryTable.id,
              orderId: orderHistoryTable.orderId,
              status: orderHistoryTable.status,
              changedBy: orderHistoryTable.changedBy,
              createdAt: orderHistoryTable.createdAt,
            })
            .from(orderHistoryTable)
            .where(inArray(orderHistoryTable.orderId, orderIds))
            .orderBy(orderHistoryTable.createdAt)
        : [];

    // First fetch the product orders with product details
    const productList = await db
      .select({
        id: productOrdersTable.id,
        variantProductId: productOrdersTable.variantProductId,
        productId: variantProductTables.productId,
        productTitle: productsTable.title,
        productSlug: productsTable.slug,
        orderId: productOrdersTable.orderId,
        quantity: productOrdersTable.quantity,
        price: productOrdersTable.price,
      })
      .from(productOrdersTable)
      .leftJoin(
        variantProductTables,
        eq(productOrdersTable.variantProductId, variantProductTables.id),
      )
      .leftJoin(
        productsTable,
        eq(variantProductTables.productId, productsTable.id),
      )
      .where(inArray(productOrdersTable.orderId, orderIds));

    // Get all variant product IDs to fetch their media
    const variantProductIds = productList.map((item) => item.variantProductId);

    // Fetch media relationships
    const productMedia = await db
      .select({
        variantProductId: variantProductsMediaTables.variantProductId,
        mediaId: variantProductsMediaTables.mediaId,
        mediaUrl: mediaTables.url,
      })
      .from(variantProductsMediaTables)
      .leftJoin(
        mediaTables,
        eq(variantProductsMediaTables.mediaId, mediaTables.id),
      )
      .where(
        and(
          inArray(
            variantProductsMediaTables.variantProductId,
            variantProductIds,
          ),
          eq(variantProductsMediaTables.isDeleted, false),
        ),
      );

    // Attach media to products
    const enhancedProductList = productList.map((product) => ({
      ...product,
      media: productMedia
        .filter((media) => media.variantProductId === product.variantProductId)
        .map((media) => ({
          id: media.mediaId,
          url: media.mediaUrl,
        })),
    }));

    // Combine orders with their history
    const data = orders.map((order) => ({
      ...order,
      productList: enhancedProductList.filter(
        (item) => item.orderId === order.id,
      ),
      orderHistory: orderHistory
        .filter((history) => history.orderId === order.id)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        .map(({ orderId, ...rest }) => rest), // Exclude orderId from history entries
    }));

    // Fetch total count for pagination
    const totalCountQuery = db
      .select({ count: count() })
      .from(ordersTable)
      .where(
        and(eq(ordersTable.userId, userId), eq(ordersTable.isDeleted, false)),
      );
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res, ORDER_ENDPOINTS.GET_USER_ORDERS);
  }
};
