import { db } from "@/db/db";

import { handleError } from "@/utils/errorHandler";
import { Request, Response } from "express";
import { validateZodSchema } from "@/middleware/validationMiddleware";
import { createProfileSchema, updateProfileSchema } from "./profileValidation";
import { eq } from "drizzle-orm";
import { profilesTable, usersTable } from "@/db/schema";

export const createProfile = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validation = validateZodSchema(createProfileSchema)(req.body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, validation.userId));

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if a profile already exists for the user
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, validation.userId));

    if (existingProfile.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A profile already exists for this user.",
      });
    }

    // Create the new profile
    const newProfile = await db
      .insert(profilesTable)
      .values(validation)
      .returning();

    // Return the response
    res.status(201).json({
      success: true,
      data: newProfile,
      message: "Profile created successfully.",
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getUsersProfile = async (req: Request, res: Response) => {
  try {
    // Extract the profile ID from the request parameters
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Check if the profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId));

    if (existingProfile.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // Return the response
    res.status(200).json({
      success: true,
      data: existingProfile,
      message: "Profile retrieved successfully.",
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validation = validateZodSchema(updateProfileSchema)(req.body);

    // Extract the profile ID from the request parameters
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Check if the profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId));

    if (existingProfile.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // Update the profile
    const updatedProfile = await db
      .update(profilesTable)
      .set(validation)
      .where(eq(profilesTable.userId, userId))
      .returning();

    // Return the response
    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Check if the profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId));

    if (existingProfile.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // Delete the profile
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId));

    // Return the response
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    handleError(error, res);
  }
};
