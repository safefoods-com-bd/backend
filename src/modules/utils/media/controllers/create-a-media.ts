import { Request, Response } from "express";
import MediaTables from "../../../db/schema/utils/media";
import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";

/**
 * Creates a new media record in the database
 * @param req Express request object
 * @param res Express response object
 */
export const createMediaV100 = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Create media record

    const newMedia = await db
      .insert(MediaTables)
      .values({
        url,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Media created successfully",
      data: newMedia[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
