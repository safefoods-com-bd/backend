import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { ordersTable, orderHistoryTable, addressesTable } from "@/db/schema";
import { guestUserOrderValidationSchema } from "../orders.validation";
import { eq, and } from "drizzle-orm";
import variantProductTables from "@/db/schema/product-management/products/variant_products";
import stocksTable from "@/db/schema/stock-management/stocks";
import productOrdersTable from "@/db/schema/order-management/products_orders";
import { ORDER_ENDPOINTS } from "@/data/endpoints";
import guestUsersTable from "@/db/schema/user-management/guestUsers";

/**
 * Creates a new order with associated product orders and initial order history record in a transaction
 * @param req Express request object containing order and product orders data
 * @param res Express response object
 * @returns JSON response with the created order data or error message
 */
export const createGuestUserOrderV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = guestUserOrderValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
      };
    }

    const {
      subTotal, // products prices
      discount, // coupon discount
      couponId,
      afterDiscountTotal, // total after discount
      deliveryCharge, // delivery charge
      deliveryZoneId,
      total, // after delivery charge
      preferredDeliveryDateAndTime,
      paymentMethodId,
      transactionNo,
      transactionPhoneNo,
      transactionDate,
      paymentStatus,
      orderStatus,
      productOrders,
      changedBy,
      fullName,
      email,
      phoneNumber,
      flatNo,
      floorNo,
      addressLine,
      postalCode,
      city,
      country,
    } = validationResult.data;

    //
    const newGuestUser = await db
      .insert(guestUsersTable)
      .values({
        fullName,
        email,
        phoneNumber,
      })
      .returning();
    console.log(newGuestUser);
    const newGuestUserAddress = await db
      .insert(addressesTable)
      .values({
        guestUserId: newGuestUser[0].id,
        flatNo,
        floorNo,
        addressLine,
        postalCode,
        city,
        country,
        name: fullName,
        phoneNo: phoneNumber,
      })
      .returning();
    console.log(newGuestUserAddress[0]);

    // Validate product orders are not empty
    if (productOrders.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "At least one product order is required",
        endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
      };
    }

    // Validate unique variantProductIds
    const variantProductIds = productOrders.map((po) => po.variantProductId);
    if (new Set(variantProductIds).size !== variantProductIds.length) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Duplicate variant product IDs in product orders",
        endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
      };
    }

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Validate variant products exist and check stock
      for (const po of productOrders) {
        const variantProduct = await tx
          .select()
          .from(variantProductTables)
          .where(eq(variantProductTables.id, po.variantProductId));
        if (variantProduct.length === 0) {
          throw {
            type: ERROR_TYPES.NOT_FOUND,
            message: `Variant product ${po.variantProductId} not found`,
            endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
          };
        }

        // Check stock availability
        const stock = await tx
          .select()
          .from(stocksTable)
          .where(
            and(
              eq(stocksTable.variantProductId, po.variantProductId),
              eq(stocksTable.warehouseId, po.warehouseId),
            ),
          );
        if (
          stock.length === 0 ||
          Number(stock[0].quantity) < Number(po.quantity)
        ) {
          throw {
            type: ERROR_TYPES.VALIDATION,
            message: `Insufficient stock for variant product ${po.variantProductId}`,
            endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
          };
        }
      }

      //generate guest user id and guest user address

      // Create order
      const newOrder = await tx
        .insert(ordersTable)
        .values({
          subTotal,
          discount,
          couponId,
          afterDiscountTotal,
          deliveryCharge,
          deliveryZoneId,
          total,
          preferredDeliveryDateAndTime: new Date(preferredDeliveryDateAndTime),
          paymentMethodId,
          transactionNo,
          transactionPhoneNo,
          transactionDate: transactionDate
            ? new Date(transactionDate)
            : undefined,
          addressId: newGuestUserAddress[0].id,
          paymentStatus,
          orderStatus,
          guestUserId: newGuestUser[0].id,
        })
        .returning();

      // Create initial order history record
      await tx.insert(orderHistoryTable).values({
        orderId: newOrder[0].id,
        status: "pending",
        changedBy: changedBy, // Default to userId if changedBy not provided
        createdAt: new Date(),
      });

      // Create product orders
      const newProductOrders = await tx
        .insert(productOrdersTable)
        .values(
          productOrders.map((po) => ({
            variantProductId: po.variantProductId,
            orderId: newOrder[0].id,
            price: po.price,
            quantity: po.quantity,
            warehouseId: po.warehouseId,
          })),
        )
        .returning();

      return { order: newOrder[0], productOrders: newProductOrders };
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: result.order,
        productOrders: result.productOrders,
        guestUserInfo: newGuestUser[0],
        guestUserAddressInfo: newGuestUserAddress[0],
      },
    });
  } catch (error) {
    console.log("Error creating order:", error);
    handleError(error, res, ORDER_ENDPOINTS.CREATE_ORDER);
  }
};
