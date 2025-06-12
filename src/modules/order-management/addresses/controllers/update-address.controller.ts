import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import { updateAddressValidationSchema } from "../addresses.validation";
import { eq } from "drizzle-orm";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";

/**
 * Updates an existing address record in the database
 * @param req Express request object containing address ID in params and update data in body
 * @param res Express response object
 * @returns JSON response with the updated address data or error message
 */
export const updateAddressV100 = async (req: Request, res: Response) => {
  try {
    // Combine params and body for validation
    const requestData = { ...req.body, id: req.params.id };

    // Validate input using Zod schema
    const validationResult =
      updateAddressValidationSchema.safeParse(requestData);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ADDRESS_ENDPOINTS.UPDATE_ADDRESS,
      };
    }

    const { id, ...updateData } = validationResult.data;

    // Check if address exists
    const existingAddress = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.id, id));

    if (existingAddress.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Address not found",
        endpoint: ADDRESS_ENDPOINTS.UPDATE_ADDRESS,
      };
    }

    // Remove undefined values from updateData to avoid updating fields with undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    // Update the address record with updatedAt timestamp
    const updatedAddress = await db
      .update(addressesTable)
      .set({
        ...filteredUpdateData,
        updatedAt: new Date(),
      })
      .where(eq(addressesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress[0],
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.UPDATE_ADDRESS);
  }
};
