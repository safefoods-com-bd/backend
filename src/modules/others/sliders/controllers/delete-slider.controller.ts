import { Request, Response } from "express";
import { eq, inArray, and } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import slidersTable from "@/db/schema/others/sliders";
import {
  deleteSliderValidationSchema,
  deleteSlidersBatchValidationSchema,
} from "../slider.validation";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a slider record (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deleteSliderV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate input using Zod schema
    const validationResult = deleteSliderValidationSchema.safeParse({ id });

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: SLIDER_ENDPOINTS.DELETE_SLIDER,
      };
    }

    // Check if slider exists and is not already deleted
    const existingSlider = await db
      .select()
      .from(slidersTable)
      .where(and(eq(slidersTable.id, id), eq(slidersTable.isDeleted, false)));

    if (existingSlider.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Slider not found or already deleted",
        endpoint: SLIDER_ENDPOINTS.DELETE_SLIDER,
      };
    }

    // Soft delete the slider by setting isDeleted to true
    const updatedSlider = await db
      .update(slidersTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(slidersTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Slider deleted successfully",
      data: updatedSlider[0],
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.DELETE_SLIDER);
  }
};

/**
 * Deletes multiple slider records (soft delete)
 * @param req Express request object
 * @param res Express response object
 */
export const deleteSlidersBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteSlidersBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: SLIDER_ENDPOINTS.DELETE_SLIDERS_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Check if sliders exist and are not already deleted
    const existingSliders = await db
      .select()
      .from(slidersTable)
      .where(
        and(inArray(slidersTable.id, ids), eq(slidersTable.isDeleted, false)),
      );

    if (existingSliders.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "No sliders found with the provided IDs",
        endpoint: SLIDER_ENDPOINTS.DELETE_SLIDERS_BATCH,
      };
    }

    // Soft delete the sliders by setting isDeleted to true
    const updatedSliders = await db
      .update(slidersTable)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(
        and(inArray(slidersTable.id, ids), eq(slidersTable.isDeleted, false)),
      )
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${updatedSliders.length} sliders`,
      data: updatedSliders,
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.DELETE_SLIDERS_BATCH);
  }
};
