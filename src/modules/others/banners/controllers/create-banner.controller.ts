import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import bannersTable from "@/db/schema/others/banners";
import { bannerValidationSchema } from "../banner.validation";
import { eq, and } from "drizzle-orm";
import { BANNER_ENDPOINTS } from "@/data/endpoints";

/**
 * Creates a new banner record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createBannerV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = bannerValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: BANNER_ENDPOINTS.CREATE_BANNER,
      };
    }

    const { title, mediaId, variantProductId } = validationResult.data;

    // Check if banner with the same title already exists
    const existingBanner = await db
      .select()
      .from(bannersTable)
      .where(
        and(eq(bannersTable.title, title), eq(bannersTable.isDeleted, false)),
      );

    if (existingBanner.length > 0) {
      throw {
        type: ERROR_TYPES.CONFLICT,
        message: "Banner with this title already exists",
        endpoint: BANNER_ENDPOINTS.CREATE_BANNER,
      };
    }

    // Create the new banner
    const newBanner = await db
      .insert(bannersTable)
      .values({
        title,
        mediaId,
        variantProductId,
      })
      .returning();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner[0],
    });
  } catch (error) {
    return handleError(error, res, BANNER_ENDPOINTS.CREATE_BANNER);
  }
};
