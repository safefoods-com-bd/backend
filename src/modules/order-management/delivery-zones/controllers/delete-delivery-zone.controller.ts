import { Request, Response } from "express";
import deliveryZoneTable from "@/db/schema/order-management/delivery_zones";
import { db } from "@/db/db";
import {
  deleteDeliveryZoneSchema,
  deleteDeliveryZonesBatchSchema,
} from "../delivery-zones.validation";
import { eq, inArray } from "drizzle-orm";

export const deleteDeliveryZoneV100 = async (req: Request, res: Response) => {
  const validation = deleteDeliveryZoneSchema.safeParse(req.params);
  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, errors: validation.error.errors });
  }
  const { id } = validation.data;
  const [deleted] = await db
    .delete(deliveryZoneTable)
    .where(eq(deliveryZoneTable.id, id))
    .returning();
  return res.status(200).json({ success: true, data: deleted });
};

export const deleteDeliveryZonesBatchV100 = async (
  req: Request,
  res: Response,
) => {
  const validation = deleteDeliveryZonesBatchSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, errors: validation.error.errors });
  }
  const { ids } = validation.data;
  const deleted = await db
    .delete(deliveryZoneTable)
    .where(inArray(deliveryZoneTable.id, ids))
    .returning();
  return res.status(200).json({ success: true, data: deleted });
};
