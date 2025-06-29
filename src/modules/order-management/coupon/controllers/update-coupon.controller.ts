import { Request, RequestHandler, Response } from "express";
import { db } from "@/db/db";
import couponsTable from "@/db/schema/order-management/coupons";
import { eq } from "drizzle-orm";
import { updateCouponValidationSchema } from "../coupon.validation";
import { COUPON_ENDPOINTS } from "@/data/endpoints";
import { handleError } from "@/utils/errorHandler";
/**
 * Updates an existing coupon
 * @param req Express request object containing coupon ID in params and update data in body
 * @param res Express response object
 */
export const updateCouponV100: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Combine params and body for validation
    const requestData = { ...req.body, id: req.params.id };

    // Validate input using Zod schema
    const validationResult =
      updateCouponValidationSchema.safeParse(requestData);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { id, title, discount, discountType, validDate, isActive } =
      validationResult.data;

    // Check if coupon exists and is not deleted
    const existingCoupon = await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.id, id));

    if (existingCoupon.length === 0) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    // Update coupon
    const filteredUpdateData = Object.fromEntries(
      Object.entries({
        title,
        discount: discount?.toString(),
        discountType,
        validDate,
        isActive,
      }).filter(([, value]) => value !== undefined),
    );

    const updatedCoupon = await db
      .update(couponsTable)
      .set({
        ...filteredUpdateData,
        updatedAt: new Date(),
      })
      .where(eq(couponsTable.id, id))
      .returning();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon[0],
    });
  } catch (error) {
    handleError(error, res, COUPON_ENDPOINTS.UPDATE_COUPON);
  }
};
