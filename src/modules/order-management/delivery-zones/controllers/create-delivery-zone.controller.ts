import { Request, Response } from "express";
import deliveryZoneTable from "@/db/schema/order-management/delivery_zones";
import { db } from "@/db/db";
import { createDeliveryZoneSchema } from "../delivery-zones.validation";
import { eq } from "drizzle-orm";
import { handleError } from "@/utils/errorHandler";
import { DELIVERY_ZONE_ENDPOINTS } from "@/data/endpoints";

export const createDeliveryZoneV100 = async (req: Request, res: Response) => {
  try {
    const validation = createDeliveryZoneSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, errors: validation.error.errors });
    }
    const data = validation.data;
    // Check if the delivery zone already exists
    const existingZone = await db
      .select()
      .from(deliveryZoneTable)
      .where(eq(deliveryZoneTable.areaName, data.areaName));

    if (existingZone.length > 0) {
      return res
        .status(409)
        .json({ success: false, error: "Delivery zone already exists" });
    }
    const [created] = await db
      .insert(deliveryZoneTable)
      .values(data)
      .returning();
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return handleError(
      error,
      res,
      DELIVERY_ZONE_ENDPOINTS.CREATE_DELIVERY_ZONE,
    );
  }
};
