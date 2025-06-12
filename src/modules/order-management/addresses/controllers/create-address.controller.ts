import { Request, Response } from "express";
import { db } from "@/db/db";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { addressesTable } from "@/db/schema";
import { addressValidationSchema } from "../addresses.validation";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";

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
      name,
      phoneNo,
      deliveryNotes,
      city,
      state,
      country,
      postalCode,
    } = validationResult.data;

    // Create address record
    const newAddress = await db
      .insert(addressesTable)
      .values({
        userId,
        flatNo,
        floorNo,
        name,
        phoneNo,
        deliveryNotes,
        city,
        state,
        country,
        postalCode,
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
