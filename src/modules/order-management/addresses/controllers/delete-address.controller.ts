import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import {
  deleteAddressValidationSchema,
  deleteAddressesBatchValidationSchema,
} from "../addresses.validation";
import { and, eq, inArray, not } from "drizzle-orm";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";
import { z } from "zod";

/**
 * Deletes a single address record from the database
 * @param req Express request object containing address ID in body
 * @param res Express response object
 * @returns JSON response indicating deletion success or error message
 */
export const deleteAddressV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = deleteAddressValidationSchema.safeParse(
      req.params,
    );

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

    // if user has multiple addresses, and the active one is deleted, make another one active
    const otherAddresses = await db
      .select()
      .from(addressesTable)
      .where(
        and(
          eq(addressesTable.userId, existingAddress[0].userId),
          not(eq(addressesTable.id, id)),
        ), // Exclude the updated address
      );
    // Deactivate all other addresses
    if (otherAddresses.length > 0) {
      await db
        .update(addressesTable)
        .set({ isActive: true })
        .where(eq(addressesTable.id, otherAddresses[0].id));
    }

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

export const createDeliveryZoneSchema = z.object({
  areaName: z.string().min(1, "Area name is required"),
  description: z.string().optional(),
  deliveryCharge: z.number().min(0, "Delivery charge must be non-negative"),
  isActive: z.boolean().optional(),
});

export const updateDeliveryZoneSchema = createDeliveryZoneSchema
  .partial()
  .extend({
    id: z.string().uuid("Invalid ID format"),
  });

export const deleteDeliveryZoneSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const deleteDeliveryZonesBatchSchema = z.object({
  ids: z
    .array(z.string().uuid("Invalid ID format"))
    .min(1, "At least one ID is required"),
});
