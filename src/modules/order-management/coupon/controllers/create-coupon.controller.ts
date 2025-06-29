import { Request, RequestHandler, Response } from "express";
import { db } from "@/db/db";
import couponsTable from "@/db/schema/order-management/coupons";
import { couponValidationSchema } from "../coupon.validation";
import { handleError } from "@/utils/errorHandler";
import { COUPON_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new coupon in the database
 * @param req Express request object containing coupon data
 * @param res Express response object
 */
export const createCouponV100: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult = couponValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { title, discount, discountType, validDate, isActive } =
      validationResult.data;

    // Convert discount to string for DB
    const insertData = {
      title,
      discount: discount.toString(),
      discountType,
      validDate,
      isActive: isActive ?? true, // Default to true if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const newCoupon = await db
      .insert(couponsTable)
      .values(insertData)
      .returning();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon[0],
    });
  } catch (error) {
    handleError(error, res, COUPON_ENDPOINTS.CREATE_COUPON);
  }
};
