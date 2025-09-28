import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import slidersTable from "@/db/schema/others/sliders";
import {
  updateSliderValidationSchema,
  UpdateSliderValidationType,
} from "../slider.validation";
import { eq, and, ne } from "drizzle-orm";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable } from "@/db/schema";

/**
 * Updates an existing slider in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateSliderV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Slider ID is required",
        endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
      };
    }

    // Validate input using Zod schema
    const validationResult = updateSliderValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
      };
    }

    // Extract validated data
    const { title, mediaUrl, variantProductId } = validationResult.data;

    // Check if slider exists
    const existingSlider = await db
      .select({
        sliders: slidersTable,
        media: mediaTable,
      })
      .from(slidersTable)
      .leftJoin(mediaTable, eq(slidersTable.mediaId, mediaTable.id))
      .where(and(eq(slidersTable.id, id), eq(slidersTable.isDeleted, false)));

    if (existingSlider.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Slider not found",
        endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
      };
    }

    // Check if another slider with the same title exists
    if (title) {
      const duplicateSlider = await db
        .select()
        .from(slidersTable)
        .where(
          and(
            eq(slidersTable.title, title),
            eq(slidersTable.isDeleted, false),
            ne(slidersTable.id, id),
          ),
        );

      if (duplicateSlider.length > 0 && duplicateSlider[0].id !== id) {
        throw {
          type: ERROR_TYPES.CONFLICT,
          message: "Another slider with this title already exists",
          endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
        };
      }
    }

    // Update the slider
    const updateData: Partial<UpdateSliderValidationType> = {};
    if (title !== undefined) updateData.title = title;

    let newMedia;
    if (mediaUrl && mediaUrl !== existingSlider[0].media?.url) {
      newMedia = await db
        .insert(mediaTable)
        .values({
          title: updateData.title || existingSlider[0].sliders.title,
          url: mediaUrl,
        })
        .returning();

      if (newMedia.length === 0) {
        throw {
          type: ERROR_TYPES.INTERNAL_SERVER_ERROR,
          message: "Failed to create media record",
          endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
        };
      }
    }

    if (variantProductId !== undefined)
      updateData.variantProductId = variantProductId;
    updateData.updatedAt = new Date();

    const updatedSlider = await db
      .update(slidersTable)
      .set({
        title: updateData.title || existingSlider[0].sliders.title,
        mediaId:
          mediaUrl && newMedia && newMedia.length > 0
            ? newMedia[0].id
            : existingSlider[0].sliders.mediaId,
        variantProductId:
          updateData.variantProductId ||
          existingSlider[0].sliders.variantProductId,
        updatedAt: updateData.updatedAt,
      })
      .where(eq(slidersTable.id, id))
      .returning();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Slider updated successfully",
      data: updatedSlider[0],
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.UPDATE_SLIDER);
  }
};
