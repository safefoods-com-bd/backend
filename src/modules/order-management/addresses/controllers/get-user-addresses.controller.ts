import { Request, Response } from "express";
import { eq, desc, count } from "drizzle-orm";
import { ERROR_TYPES, handleError } from "@/utils/errorHandler";
import { db } from "@/db/db";
import addressesTable from "@/db/schema/order-management/addresses";
import { ADDRESS_ENDPOINTS } from "@/data/endpoints";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { getUserAddressesValidationSchema } from "../addresses.validation";

/**
 * Retrieves all addresses for a specific user with pagination
 * @param req Express request object containing the user ID in params
 * @param res Express response object
 * @returns JSON response with the user's addresses or error message
 */
export const getUserAddressesV100 = async (req: Request, res: Response) => {
  try {
    // Validate and parse user ID from params
    const validation = getUserAddressesValidationSchema.safeParse(req.params);
    if (!validation.success) {
      throw {
        type: ERROR_TYPES.VALIDATION,
        message: validation.error.errors.map((err) => err.message).join(", "),
      };
    }

    const { userId } = validation.data;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";

    const query = db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.userId, userId))
      .orderBy(
        sort === "desc"
          ? desc(addressesTable.createdAt)
          : addressesTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

    const totalCountQuery = db
      .select({ count: count() })
      .from(addressesTable)
      .where(eq(addressesTable.userId, userId));
    const totalCount = await totalCountQuery;

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const _links = generateHateoasLinksForCollection({
      baseUrl,
      offset,
      limit,
      totalCount: totalCount[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      message: "User addresses fetched successfully",
      data: data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
    });
  } catch (error) {
    handleError(error, res, ADDRESS_ENDPOINTS.GET_USER_ADDRESSES);
  }
};
