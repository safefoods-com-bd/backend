import { updateGeneralSettingsSchema } from "../generalSettingsValidation";

import { db } from "@/db/db";
import { handleError } from "@/utils/errorHandler";
import { Request, Response } from "express";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import generalSettingsTable from "@/db/schema/general-settings/general_settings";

export const updateGeneralSettingsV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const validation = validateZodSchema(updateGeneralSettingsSchema)(req.body);

    // Fetch the existing general settings record (there should only be one)
    const existingSettings = await db
      .select()
      .from(generalSettingsTable)
      .limit(1);

    if (existingSettings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "General settings record not found",
      });
    }

    // Update the single general settings record
    const updatedSettings = await db
      .update(generalSettingsTable)
      .set(validation) // Only update the fields provided in the request body
      .returning();

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: "General settings updated successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
};
