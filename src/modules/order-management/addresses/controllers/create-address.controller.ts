import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import { addressValidationSchema } from "../addresses.validation";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";
import { eq } from "drizzle-orm";

/**
 * Creates a new address record in the database
 * @param req Express request object containing address data
 * @param res Express response object
 * @returns JSON response with the created address data or error message
 */
export const createAddressV100 = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validationResult = addressValidationSchema.safeParse(req.body);

    if (!validationResult.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: "Validation failed",
        errors: validationResult.error.errors,
        endpoint: ADDRESS_ENDPOINTS.CREATE_ADDRESS,
      };
    }

    const {
      userId,
      flatNo,
      floorNo,
      addressLine,
      name,
      phoneNo,
      deliveryNotes,
      city,
      state,
      country,
      postalCode,
      isActive = false, // Default to false if not provided
    } = validationResult.data;

    // check the users already has addresses
    const existingAddress = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.userId, userId));

    // Create address record
    const newAddress = await db
      .insert(addressesTable)
      .values({
        userId,
        flatNo,
        floorNo,
        addressLine,
        name,
        phoneNo,
        deliveryNotes,
        city,
        state,
        country,
        postalCode,
        isActive: existingAddress.length === 0 ? true : isActive, // Set isActive to true only if no existing addresses
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: newAddress[0],
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.CREATE_ADDRESS);
  }
};
