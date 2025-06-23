import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { ordersTable, orderHistoryTable } from "@/db/schema";
import { updateOrderValidationSchema } from "../orders.validation";
import { eq, and, sql } from "drizzle-orm";
import stocksTable from "@/db/schema/stock-management/stocks";
import productOrdersTable from "@/db/schema/order-management/products_orders";
import { ORDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing order, decreases stock if status changes to shipped, and creates order history if status changes
 * @param req Express request object containing order ID in params and update data in body
 * @param res Express response object
 * @returns JSON response with the updated order data or error message
 */
export const updateOrderV100 = async (req: Request, res: Response) => {
  try {
    // Combine params and body for validation
    const requestData = { ...req.body, id: req.params.id };

    // Validate input using Zod schema
    const validationResult = updateOrderValidationSchema.safeParse(requestData);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ORDER_ENDPOINTS.UPDATE_ORDER,
      };
    }

    const { id, orderStatus, changedBy, ...updateData } = validationResult.data;

    // Check if order exists and is not deleted
    const existingOrder = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, id), eq(ordersTable.isDeleted, false)));

    if (existingOrder.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Order not found",
        endpoint: ORDER_ENDPOINTS.UPDATE_ORDER,
      };
    }

    // Validate state transitions
    const currentStatus = existingOrder[0].orderStatus;
    const validTransitions: Record<string, string[]> = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    if (
      orderStatus &&
      !validTransitions[currentStatus].includes(orderStatus) &&
      orderStatus !== currentStatus
    ) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: `Invalid status transition from ${currentStatus} to ${orderStatus}`,
        endpoint: ORDER_ENDPOINTS.UPDATE_ORDER,
      };
    }

    let updatedOrder;
    // Handle stock decrease and order history if status changes to shipped
    if (orderStatus === "shipped" && currentStatus !== "shipped") {
      updatedOrder = await db.transaction(async (tx) => {
        // Fetch product orders
        const productOrders = await tx
          .select()
          .from(productOrdersTable)
          .where(
            and(
              eq(productOrdersTable.orderId, id),
              eq(productOrdersTable.isDeleted, false),
            ),
          );

        // Check stock availability and update stock
        for (const po of productOrders) {
          const stock = await tx
            .select()
            .from(stocksTable)
            .where(eq(stocksTable.variantProductId, po.variantProductId))
            .for("update"); // Lock row to prevent race conditions
          if (
            stock.length === 0 ||
            Number(stock[0].quantity) < Number(po.quantity)
          ) {
            throw {
              type: ERROR_TYPES.VALIDATION,
              message: `Insufficient stock for variant product ${po.variantProductId}`,
              endpoint: ORDER_ENDPOINTS.UPDATE_ORDER,
            };
          }

          // Decrease stock
          await tx
            .update(stocksTable)
            .set({
              quantity: sql`${stocksTable.quantity} - ${Number(po.quantity)}`,
              updatedAt: new Date(),
            })
            .where(eq(stocksTable.variantProductId, po.variantProductId));
        }

        // Update order
        const filteredUpdateData = Object.fromEntries(
          Object.entries({ ...updateData, orderStatus }).filter(
            ([, value]) => value !== undefined,
          ),
        );

        const updated = await tx
          .update(ordersTable)
          .set({
            ...filteredUpdateData,
            updatedAt: new Date(),
          })
          .where(eq(ordersTable.id, id))
          .returning();

        // Create order history record
        await tx.insert(orderHistoryTable).values({
          orderId: id,
          status: orderStatus,
          changedBy: changedBy || existingOrder[0].userId, // Default to order's userId if changedBy not provided
          createdAt: new Date(),
        });

        return updated;
      });
    } else {
      // Regular update with order history if status changes
      updatedOrder = await db.transaction(async (tx) => {
        const filteredUpdateData = Object.fromEntries(
          Object.entries({ ...updateData, orderStatus }).filter(
            ([, value]) => value !== undefined,
          ),
        );

        const updated = await tx
          .update(ordersTable)
          .set({
            ...filteredUpdateData,
            updatedAt: new Date(),
          })
          .where(eq(ordersTable.id, id))
          .returning();

        // Create order history record if status changed
        if (orderStatus && orderStatus !== currentStatus) {
          await tx.insert(orderHistoryTable).values({
            orderId: id,
            status: orderStatus,
            changedBy: changedBy || existingOrder[0].userId, // Default to order's userId if changedBy not provided
            createdAt: new Date(),
          });
        }

        return updated;
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder[0],
    });
  } catch (error) {
    handleError(error, res, ORDER_ENDPOINTS.UPDATE_ORDER);
  }
};
