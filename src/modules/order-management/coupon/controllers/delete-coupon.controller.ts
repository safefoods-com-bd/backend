import { Request, RequestHandler, Response } from "express";
import { db } from "@/db/db";
import couponsTable from "@/db/schema/order-management/coupons";
import { eq } from "drizzle-orm";
import { deleteCouponValidationSchema } from "../coupon.validation";
import { COUPON_ENDPOINTS } from "@/data/endpoints";
import { handleError } from "@/utils/errorHandler";

/**
 * Soft deletes a single coupon
 * @param req Express request object containing coupon ID in body
 * @param res Express response object
 */
export const deleteCouponV100: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteCouponValidationSchema.safeParse(req.params);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
      return;
    }

    const { id } = validationResult.data;

    // Check if coupon exists and is not deleted
    const existingCoupon = await db.select().from(couponsTable);
    // .where(and(eq(couponsTable.id, id), eq(couponsTable.isDeleted, false)));

    if (existingCoupon.length === 0) {
      res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
      return;
    }

    // Soft delete coupon
    await db
      .delete(couponsTable)

      .where(eq(couponsTable.id, id));

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    handleError(error, res, COUPON_ENDPOINTS.DELETE_COUPON);
  }
};

/**
 * Soft deletes multiple coupons
 * @param req Express request object containing array of coupon IDs in body
 * @param res Express response object
 */
// export const deleteCouponsBatchV100: RequestHandler = async (req, res) => {
//   try {
//     // Validate input using Zod schema
//     const validationResult = deleteCouponsBatchValidationSchema.safeParse(req.body);

//     if (!validationResult.success) {
//       res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: validationResult.error.errors,
//       });
//       return;
//     }

//     const { ids } = validationResult.data;

//     // Check if all coupons exist and are not deleted
//     const existingCoupons = await db
//       .select()
//       .from(couponsTable)
//       .where(and(inArray(couponsTable.id, ids), eq(couponsTable.isDeleted, false)));

//     if (existingCoupons.length !== ids.length) {
//       res.status(404).json({
//         success: false,
//         message: "One or more coupons not found",
//       });
//       return;
//     }

//     // Soft delete coupons
//     await db
//       .update(couponsTable)
//       .set({
//         isDeleted: true,
//         updatedAt: new Date(),
//       })
//       .where(inArray(couponsTable.id, ids));

//     res.status(200).json({
//       success: true,
//       message: "Coupons deleted successfully",
//     });
//   } catch (error) {
//     handleError(error, res, COUPON_ENDPOINTS.DELETE_COUPONS_BATCH);
//   }
// };
