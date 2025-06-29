import { Request, Response, RequestHandler } from "express";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import couponsTable from "@/db/schema/order-management/coupons";
import { validateCouponValidationSchema } from "../coupon.validation";
import { and, eq, sql } from "drizzle-orm";
import { COUPON_ENDPOINTS } from "@/data/endpoints";

/**
 * Validates a coupon and returns its details if valid
 * @param req Express request object containing coupon ID
 * @param res Express response object
 */
export const validateCouponV100: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult = validateCouponValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { couponId } = validationResult.data;

    // Check if coupon is valid
    const coupon = await db
      .select({
        id: couponsTable.id,
        title: couponsTable.title,
        discount: couponsTable.discount,
        discountType: couponsTable.discountType,
        validDate: couponsTable.validDate,
        isActive: couponsTable.isActive,
      })
      .from(couponsTable)
      .where(
        and(
          eq(couponsTable.id, couponId),
          eq(couponsTable.isActive, true),
          //   eq(couponsTable.isDeleted, false),
          sql`valid_date >= ${new Date().toISOString().split("T")[0]}`,
        ),
      );

    if (coupon.length === 0) {
      res.status(404).json({
        success: false,
        message: "Coupon not found or invalid",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: coupon[0],
    });
  } catch (error) {
    handleError(error, res, COUPON_ENDPOINTS.VALIDATE_COUPON);
  }
};
