import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import bannersTable from "@/db/schema/others/banners";
import {
  updateBannerValidationSchema,
  UpdateBannerValidationType,
} from "../banner.validation";
import { eq, and, ne } from "drizzle-orm";
import { BANNER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable } from "@/db/schema";

/**
 * Updates an existing banner in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateBannerV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Banner ID is required",
        endpoint: BANNER_ENDPOINTS.UPDATE_BANNER,
      };
    }

    // Validate input using Zod schema
    const validationResult = updateBannerValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BANNER_ENDPOINTS.UPDATE_BANNER,
      };
    }

    // Extract validated data
    const { title, mediaUrl, variantProductId } = validationResult.data;

    // Check if banner exists
    const existingBanner = await db
      .select()
      .from({ ...bannersTable, mediaUrl: mediaTable.url })
      .leftJoin(mediaTable, eq(bannersTable.mediaId, mediaTable.id))
      .where(and(eq(bannersTable.id, id), eq(bannersTable.isDeleted, false)));

    if (existingBanner.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Banner not found",
        endpoint: BANNER_ENDPOINTS.UPDATE_BANNER,
      };
    }

    // Check if another banner with the same title exists
    if (title) {
      const duplicateBanner = await db
        .select()
        .from(bannersTable)
        .where(
          and(
            eq(bannersTable.title, title),
            eq(bannersTable.isDeleted, false),
            ne(bannersTable.id, id),
          ),
        );

      if (duplicateBanner.length > 0 && duplicateBanner[0].id !== id) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Another banner with this title already exists",
          endpoint: BANNER_ENDPOINTS.UPDATE_BANNER,
        };
      }
    }

    // Update the banner
    const updateData: Partial<UpdateBannerValidationType> = {};
    if (title !== undefined) updateData.title = title;

    let newMedia;
    if (mediaUrl && mediaUrl !== existingBanner[0].media?.url) {
      newMedia = await db
        .insert(mediaTable)
        .values({
          title: updateData.title || existingBanner[0].banners.title,
          url: mediaUrl,
        })
        .returning();

      if (newMedia.length === 0) {
        throw {
          type: ERROR_TYPES.INTERNAL_SERVER_ERROR,
          message: "Failed to create media record",
          endpoint: BANNER_ENDPOINTS.UPDATE_BANNER,
        };
      }
    }

    if (variantProductId !== undefined)
      updateData.variantProductId = variantProductId;
    updateData.updatedAt = new Date();

    const updatedBanner = await db
      .update(bannersTable)
      .set({
        title: updateData.title || existingBanner[0].banners.title,
        mediaId:
          mediaUrl && newMedia && newMedia.length > 0
            ? newMedia[0].id
            : existingBanner[0].banners.mediaId,
        variantProductId:
          updateData.variantProductId ||
          existingBanner[0].banners.variantProductId,
        updatedAt: updateData.updatedAt,
      })
      .where(eq(bannersTable.id, id))
      .returning();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner[0],
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.UPDATE_BANNER);
  }
};
