import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import {
  deleteAddressValidationSchema,
  deleteAddressesBatchValidationSchema,
} from "../addresses.validation";
import { eq, inArray } from "drizzle-orm";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";

/**
 * Deletes a single address record from the database
 * @param req Express request object containing address ID in body
 * @param res Express response object
 * @returns JSON response indicating deletion success or error message
 */
export const deleteAddressV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteAddressValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ADDRESS_ENDPOINTS.DELETE_ADDRESS,
      };
    }

    const { id } = validationResult.data;

    // Check if address exists
    const existingAddress = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.id, id));

    if (existingAddress.length === 0) {
      throw {
        type: ERROR_TYPES.NOT_FOUND,
        message: "Address not found",
        endpoint: ADDRESS_ENDPOINTS.DELETE_ADDRESS,
      };
    }

    // Delete the address record
    const deletedAddress = await db
      .delete(addressesTable)
      .where(eq(addressesTable.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress[0],
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.DELETE_ADDRESS);
  }
};

/**
 * Deletes multiple address records from the database in a batch operation
 * @param req Express request object containing array of address IDs in body
 * @param res Express response object
 * @returns JSON response indicating batch deletion success or error message
 */
export const deleteAddressesBatchV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteAddressesBatchValidationSchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ADDRESS_ENDPOINTS.DELETE_ADDRESSES_BATCH,
      };
    }

    const { ids } = validationResult.data;

    // Delete the address records
    const deletedAddresses = await db
      .delete(addressesTable)
      .where(inArray(addressesTable.id, ids))
      .returning();

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedAddresses.length} addresses`,
      data: deletedAddresses,
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.DELETE_ADDRESSES_BATCH);
  }
};
