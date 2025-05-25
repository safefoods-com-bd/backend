import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import mediaTables from "@/db/schema/utils/media";

/**
 * Deletes a single media record from the database by ID
 * @param req Express request object
 * @param res Express response object
 */
export const deleteMediaSingleV100 = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      throw { type: ERROR_TYPES.VALIDATION, message: "Media ID is required" };
    }

    const deletedMedia = await db
      .delete(mediaTables)
      .where(eq(mediaTables.id, id))
      .returning();

    if (deletedMedia.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Media not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      data: deletedMedia[0],
    });
  } catch (error) {
    handleError(error, res, "DELETE: /api/media/v1");
  }
};

/**
 * Deletes multiple media records from the database by IDs array
 * @param req Express request object
 * @param res Express response object
 */
export const deleteMediaBatchV100 = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    // Validate input
    if (!ids) {
      throw { type: ERROR_TYPES.VALIDATION, message: "IDs array is required" };
    }

    if (!Array.isArray(ids)) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "The ids parameter must be an array",
      };
    }

    if (ids.length === 0) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "The ids array cannot be empty",
      };
    }

    const deletedMedia = await db
      .delete(mediaTables)
      .where(inArray(mediaTables.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedMedia.length} media records`,
      data: deletedMedia,
    });
  } catch (error) {
    handleError(error, res, "DELETE: /api/media/v1/batch");
  }
};
