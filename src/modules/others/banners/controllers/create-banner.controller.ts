import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import bannersTable from "@/db/schema/others/banners";
import { bannerValidationSchema } from "../banner.validation";
import { eq, and } from "drizzle-orm";
import { BANNER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable } from "@/db/schema";
import variantProductTables from "@/db/schema/product-management/products/variant_products";

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

    const { title, mediaUrl, variantProductId } = validationResult.data;
    console.log(title, mediaUrl, variantProductId);

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

    // Check if media URL is provided and and create a media record if necessary
    let newMedia;
    if (mediaUrl) {
      newMedia = await db
        .insert(mediaTable)
        .values({
          title: title,
          url: mediaUrl,
        })
        .returning();
    }

    // check if variantProductId exists in products table if provided
    if (variantProductId) {
      const variantExists = await db
        .select()
        .from(variantProductTables)
        .where(
          and(
            eq(variantProductTables.id, variantProductId),
            eq(variantProductTables.isDeleted, false),
          ),
        );
      // console.log(variantExists);
      if (variantExists.length === 0) {
        throw {
          type: ERROR_TYPES.NOT_FOUND,
          message: "Variant Product with this ID does not exist",
          endpoint: BANNER_ENDPOINTS.CREATE_BANNER,
        };
      }
    }

    // Create the new banner
    const newBanner = await db
      .insert(bannersTable)
      .values({
        title,
        mediaId:
          mediaUrl && newMedia && newMedia.length > 0 ? newMedia[0].id : null,
        variantProductId,
      })
      .returning();
    console.log(newBanner);

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
