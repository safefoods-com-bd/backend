import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import mediaTables from "@/db/schema/utils/media";

/**
 * Creates a new media record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createMediaV100 = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { url, title } = req.body;

    if (!url) {
      throw { type: ERROR_TYPES.VALIDATION, message: "URL is required" };
    }

    // Create media record

    const newMedia = await db
      .insert(mediaTables)
      .values({
        url,
        title,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Media created successfully",
      data: newMedia[0],
    });
  } catch (error) {
    handleError(error, res, "POST: /api/media/v1");
  }
};
