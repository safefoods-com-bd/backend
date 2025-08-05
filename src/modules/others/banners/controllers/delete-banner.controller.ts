import { Request, Response } from "express";
import { eq, inArray, and } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import bannersTable from "@/db/schema/others/banners";
import {
  deleteBannerValidationSchema,
  deleteBannersBatchValidationSchema,
} from "../banner.validation";
import { BANNER_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a banner record (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deleteBannerV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate input using Zod schema
    const validationResult = deleteBannerValidationSchema.safeParse({ id });

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BANNER_ENDPOINTS.DELETE_BANNER,
      };
    }

    // Check if banner exists and is not already deleted
    const existingBanner = await db
      .select()
      .from(bannersTable)
      .where(and(eq(bannersTable.id, id), eq(bannersTable.isDeleted, false)));

    if (existingBanner.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Banner not found or already deleted",
        endpoint: BANNER_ENDPOINTS.DELETE_BANNER,
      };
    }

    // Soft delete the banner by setting isDeleted to true
    const updatedBanner = await db
      .update(bannersTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(bannersTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
      data: updatedBanner[0],
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.DELETE_BANNER);
  }
};

/**
 * Deletes multiple banner records (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deleteBannersBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteBannersBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BANNER_ENDPOINTS.DELETE_BANNERS_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Check if banners exist and are not already deleted
    const existingBanners = await db
      .select()
      .from(bannersTable)
      .where(
        and(inArray(bannersTable.id, ids), eq(bannersTable.isDeleted, false)),
      );

    if (existingBanners.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "No banners found with the provided IDs",
        endpoint: BANNER_ENDPOINTS.DELETE_BANNERS_BATCH,
      };
    }

    // Soft delete the banners by setting isDeleted to true
    const updatedBanners = await db
      .update(bannersTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(
        and(inArray(bannersTable.id, ids), eq(bannersTable.isDeleted, false)),
      )
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${updatedBanners.length} banners`,
      data: updatedBanners,
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.DELETE_BANNERS_BATCH);
  }
};
