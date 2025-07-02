import { z } from "zod";

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
