import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import slidersTable from "@/db/schema/others/sliders";
import { sliderValidationSchema } from "../slider.validation";
import { eq, and } from "drizzle-orm";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new slider record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createSliderV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = sliderValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: SLIDER_ENDPOINTS.CREATE_SLIDER,
      };
    }

    const { title, mediaId } = validationResult.data;

    // Check if slider with the same title already exists
    const existingSlider = await db
      .select()
      .from(slidersTable)
      .where(
        and(eq(slidersTable.title, title), eq(slidersTable.isDeleted, false)),
      );

    if (existingSlider.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Slider with this title already exists",
        endpoint: SLIDER_ENDPOINTS.CREATE_SLIDER,
      };
    }

    // Create the new slider
    const newSlider = await db
      .insert(slidersTable)
      .values({
        title,
        mediaId,
      })
      .returning();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Slider created successfully",
      data: newSlider[0],
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.CREATE_SLIDER);
  }
};
