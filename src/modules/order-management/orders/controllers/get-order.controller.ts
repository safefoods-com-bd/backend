import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { ordersTable } from "@/db/schema";

import { getUserOrdersValidationSchema } from "../orders.validation";
import { eq, desc, count, and } from "drizzle-orm";

import { ORDER_ENDPOINTS } from "@/data/endpoints";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
/**
 * Retrieves all orders for a specific user with pagination
 * @param req Express request object containing the user ID in params
 * @param res Express response object
 * @returns JSON response with the user's orders or error message
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

    const query = db
      .select()
      .from(ordersTable)
      .where(
        and(eq(ordersTable.userId, userId), eq(ordersTable.isDeleted, false)),
      )
      .orderBy(
        sort === "desc" ? desc(ordersTable.createdAt) : ordersTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

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
      data: data,
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
