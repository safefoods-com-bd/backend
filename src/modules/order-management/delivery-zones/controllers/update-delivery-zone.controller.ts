import { Request, Response } from "express";
import deliveryZoneTable from "@/db/schema/order-management/delivery_zones";
import { db } from "@/db/db";
import { updateDeliveryZoneSchema } from "../delivery-zones.validation";
import { eq } from "drizzle-orm";
import { handleError } from "@/utils/errorHandler";
import { DELIVERY_ZONE_ENDPOINTS } from "@/data/endpoints";

export const updateDeliveryZoneV100 = async (req: Request, res: Response) => {
  try {
    const validation = updateDeliveryZoneSchema.safeParse({
      ...req.body,
      id: req.params.id,
    });
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, errors: validation.error.errors });
    }
    const { id, ...data } = validation.data;
    const [updated] = await db
      .update(deliveryZoneTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(deliveryZoneTable.id, id))
      .returning();
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    handleError(error, res, DELIVERY_ZONE_ENDPOINTS.UPDATE_DELIVERY_ZONE);
  }
};
