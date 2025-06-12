import { db } from "@/db/db";
import paymentMethodTable from "@/db/schema/order-management/payment_methods";
import { count, desc, eq, and } from "drizzle-orm";
import { Request, Response } from "express";
import { handleError } from "@/utils/errorHandler";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { PAYMENT_METHOD_ENDPOINTS } from "@/data/endpoints";

/**
 * Controller function to retrieve payment methods data with pagination and HATEOAS links.
 *
 * @param req - Express Request object containing query parameters:
 *   - limit: (optional) Number of records to return per page, defaults to 10
 *   - offset: (optional) Number of records to skip, defaults to 0
 *   - sort: (optional) Sort order, either "desc" or "asc", defaults to "desc"
 *   - isActive: (optional) Filter by active status
 *   - isDeleted: (optional) Filter by deleted status, defaults to false
 *
 * @param res - Express Response object
 *
 * @returns JSON response with:
 *   - success: Boolean indicating if the operation was successful
 *   - data: Array of payment method records
 *   - pagination: Object containing pagination details (offset, limit, total, currentCount)
 *   - _links: HATEOAS links for navigating the collection
 *   - message: Success message
 *
 * @throws Handles and processes any errors using the handleError utility function
 */
export const listAllPaymentMethodsV100 = async (
  req: Request,
  res: Response,
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || "desc";
    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;
    const isDeleted =
      req.query.isDeleted !== undefined
        ? req.query.isDeleted === "true"
        : false;

    // Build where condition
    let whereCondition;
    if (isActive !== undefined && !isDeleted) {
      whereCondition = and(
        eq(paymentMethodTable.isActive, isActive),
        eq(paymentMethodTable.isDeleted, isDeleted),
      );
    } else if (isActive !== undefined) {
      whereCondition = eq(paymentMethodTable.isActive, isActive);
    } else {
      whereCondition = eq(paymentMethodTable.isDeleted, isDeleted);
    }

    const query = db
      .select()
      .from(paymentMethodTable)
      .where(whereCondition)
      .orderBy(
        sort === "desc"
          ? desc(paymentMethodTable.createdAt)
          : paymentMethodTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

    const totalCountQuery = db
      .select({ count: count() })
      .from(paymentMethodTable)
      .where(whereCondition);

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
      data: data,
      pagination: {
        offset,
        limit,
        total: totalCount[0]?.count,
        currentCount: data.length,
      },
      _links,
      message: "Payment methods fetched successfully",
    });
  } catch (error) {
    handleError(error, res, PAYMENT_METHOD_ENDPOINTS.LIST_ALL_PAYMENT_METHODS);
  }
};
