import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { ordersTable } from "@/db/schema";

import { orderValidationSchema } from "../orders.validation";
import { eq, and } from "drizzle-orm";

import variantProductTables from "@/db/schema/product-management/products/variant_products";
import stocksTable from "@/db/schema/stock-management/stocks";
import productOrdersTable from "@/db/schema/order-management/products_orders";
import { ORDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new order with associated product orders in a transaction
 * @param req Express request object containing order and product orders data
 * @param res Express response object
 * @returns JSON response with the created order data or error message
 */
export const createOrderV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = orderValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ORDER_ENDPOINTS.CREATE_ORDER,
      };
    }

    const {
      subTotal,
      total,
      afterDiscountTotal,
      paymentStatus,
      orderStatus,
      productOrders,
    } = validationResult.data;

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

        // Check stock availability (assuming one warehouse for simplicity)
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

      // Create order
      const newOrder = await tx
        .insert(ordersTable)
        .values({
          subTotal,
          total,
          afterDiscountTotal,
          paymentStatus,
          orderStatus,
        })
        .returning();

      // Create product orders
      const newProductOrders = await tx
        .insert(productOrdersTable)
        .values(
          productOrders.map((po) => ({
            variantProductId: po.variantProductId,
            orderId: newOrder[0].id,
            price: po.price,
            quantity: po.quantity,
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
      },
    });
  } catch (error) {
    handleError(error, res, ORDER_ENDPOINTS.CREATE_ORDER);
  }
};
