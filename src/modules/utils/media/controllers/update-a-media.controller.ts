import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { eq } from "drizzle-orm";
import mediaTables from "@/db/schema/utils/media";
import { updateMediaValidationSchema } from "../media.validation";
/**
 * Updates a media record in the database.
 *
 * @async
 * @function PATCH
 * @param {Request} req - Express request object containing the media update data in the body
 * @param {Response} res - Express response object used to send back the API response
 * @returns {Promise<Response>} A Promise resolving to a response with the updated media data
 *
 * @throws {Object} Throws an error object with type VALIDATION if request body validation fails
 * @throws {Object} Throws an error object with type NOT_FOUND if media with the given id doesn't exist
 *
 * @description
 * This controller handles PATCH requests to update media records.
 * It validates the incoming request body against updateMediaValidationSchema.
 * If validation passes, it updates the media record with the provided fields.
 * Only fields that are provided in the request are updated (partial update).
 * Returns a 200 status with the updated media record on success.
 */
export const PATCH = async (req: Request, res: Response) => {
  try {
    const validation = updateMediaValidationSchema.safeParse(await req.body);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }
    const { id, url, title } = validation.data;

    // Update media record
    const updatedMedia = await db
      .update(mediaTables)
      .set({
        ...(url && { url }),
        ...(title && { title }),
      })
      .where(eq(mediaTables.id, id))
      .returning();

    if (updatedMedia.length === 0) {
      throw { type: ERROR_TYPES.NOT_FOUND, message: "Media not found" };
    }

    return res.status(200).json({
      success: true,
      message: "Media updated successfully",
      data: updatedMedia[0],
    });
  } catch (error) {
    handleError(error, res);
  }
};
