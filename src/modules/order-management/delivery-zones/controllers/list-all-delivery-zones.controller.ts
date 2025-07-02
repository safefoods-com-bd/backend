import { Request, Response } from "express";
import deliveryZoneTable from "@/db/schema/order-management/delivery-zones";
import { db } from "@/db/db";
import { and, count, desc, eq } from "drizzle-orm";
import { generateHateoasLinksForCollection } from "@/utils/generateHateoasLinks";
import { handleError } from "@/utils/errorHandler";
import { DELIVERY_ZONE_ENDPOINTS } from "@/data/endpoints";

export const listAllDeliveryZonesV100 = async (req: Request, res: Response) => {
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
    let whereCondition;
    if (isActive !== undefined && !isDeleted) {
      whereCondition = and(
        eq(deliveryZoneTable.isActive, isActive),
        eq(deliveryZoneTable.isDeleted, isDeleted),
      );
    } else if (isActive !== undefined) {
      whereCondition = eq(deliveryZoneTable.isActive, isActive);
    } else {
      whereCondition = eq(deliveryZoneTable.isDeleted, isDeleted);
    }

    const query = db
      .select()
      .from(deliveryZoneTable)
      .where(whereCondition)
      .orderBy(
        sort === "desc"
          ? desc(deliveryZoneTable.createdAt)
          : deliveryZoneTable.createdAt,
      )
      .offset(offset)
      .limit(limit);

    const data = await query;

    const totalCountQuery = db
      .select({ count: count() })
      .from(deliveryZoneTable)
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
      message: "Delivery zones fetched successfully",
    });
  } catch (error) {
    handleError(error, res, DELIVERY_ZONE_ENDPOINTS.LIST_ALL_DELIVERY_ZONES);
  }
};
