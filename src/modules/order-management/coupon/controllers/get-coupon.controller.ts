import { Request, RequestHandler, Response } from "express";
import { db } from "@/db/db";
import couponsTable from "@/db/schema/order-management/coupons";
import { COUPON_ENDPOINTS } from "@/data/endpoints";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { and, count, desc, eq } from "drizzle-orm";
import { getCouponsValidationSchema } from "../coupon.validation";
/**
 * Retrieves all coupons with pagination and optional filtering by isActive
 * @param req Express request object containing query params for pagination and filtering
 * @param res Express response object
 */
export const getCouponsV100: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate query params using Zod schema
    const validationResult = getCouponsValidationSchema.safeParse(req.query);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
      return;
    }

    const {
      limit = 10,
      offset = 0,
      sort = "desc",
      isActive,
    } = validationResult.data;

    // Build query with optional isActive filter
    const query = db
      .select()
      .from(couponsTable)
      .where(
        and(
          // eq(couponsTable.isDeleted, false),
          isActive !== undefined
            ? eq(couponsTable.isActive, isActive)
            : undefined,
        ),
      )
      .orderBy(
        sort === "desc" ? desc(couponsTable.createdAt) : couponsTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const coupons = await query;

    // Fetch total count for pagination
    const totalCountQuery = db
      .select({ count: count() })
      .from(couponsTable)
      .where(
        and(
          // eq(couponsTable.isDeleted, false),
          isActive !== undefined
            ? eq(couponsTable.isActive, isActive)
            : undefined,
        ),
      );
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: coupons.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res, COUPON_ENDPOINTS.LIST_ALL_COUPONS);
  }
};
