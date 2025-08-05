import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import slidersTable from "@/db/schema/others/sliders";
import {
  updateSliderValidationSchema,
  UpdateSliderValidationType,
} from "../slider.validation";
import { eq, and } from "drizzle-orm";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing slider in the database
 * @param req Express request object
 * @param res Express response object
 */
export const updateSliderV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationData = { ...req.body, id };

    // Validate input using Zod schema
    const validationResult =
      updateSliderValidationSchema.safeParse(validationData);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: SLIDER_ENDPOINTS.UPDATE_SLIDER,
      };
    }

    const { title, mediaId } = validationResult.data;

    // Check if slider exists
    const existingSlider = await db
      .select()
      .from(slidersTable)
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
          and(eq(slidersTable.title, title), eq(slidersTable.isDeleted, false)),
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
    if (mediaId !== undefined) updateData.mediaId = mediaId;
    updateData.updatedAt = new Date();

    const updatedSlider = await db
      .update(slidersTable)
      .set(updateData)
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
