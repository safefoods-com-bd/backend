import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import { updateAddressValidationSchema } from "../addresses.validation";
import { and, eq, not } from "drizzle-orm";
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

    // Update the address record with updatedAt timestamp
    const updatedAddress = await db
      .update(addressesTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(addressesTable.id, id))
      .returning();

    if (updateData.isActive === true && updatedAddress[0].isActive === true) {
      //get all other addresses of the user except the updated one
      const otherAddresses = await db
        .select()
        .from(addressesTable)
        .where(
          and(
            eq(addressesTable.userId, updatedAddress[0].userId!),
            not(eq(addressesTable.id, id)),
          ), // Exclude the updated address
        );
      // Deactivate all other addresses
      if (otherAddresses.length > 0) {
        await db
          .update(addressesTable)
          .set({ isActive: false })
          .where(
            and(
              eq(addressesTable.userId, updatedAddress[0].userId!),
              not(eq(addressesTable.id, id)),
            ),
          );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress[0],
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.UPDATE_ADDRESS);
  }
};
