import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import slidersTable from "@/db/schema/others/sliders";
import { eq, and } from "drizzle-orm";
import { SLIDER_ENDPOINTS } from "@/data/endpoints";
import { mediaTable } from "@/db/schema";

/**
 * Gets a single slider by ID
 * @param req Express request object
 * @param res Express response object
 */
export const getSingleSliderV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Slider ID is required",
        endpoint: SLIDER_ENDPOINTS.GET_SINGLE_SLIDER,
      };
    }

    const slider = await db
      .select({
        id: slidersTable.id,
        title: slidersTable.title,
        url: mediaTable.url,
        isDeleted: slidersTable.isDeleted,
        createdAt: slidersTable.createdAt,
        updatedAt: slidersTable.updatedAt,
      })
      .from(slidersTable)
      .leftJoin(mediaTable, eq(slidersTable.mediaId, mediaTable.id))
      .where(and(eq(slidersTable.id, id), eq(slidersTable.isDeleted, false)));

    if (slider.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Slider not found",
        endpoint: SLIDER_ENDPOINTS.GET_SINGLE_SLIDER,
      };
    }

    return res.status(200).json({
      success: true,
      data: slider[0],
      message: "Slider fetched successfully",
    });
  } catch (error) {
    return handleError(error, res, SLIDER_ENDPOINTS.GET_SINGLE_SLIDER);
  }
};
