import { Router, RequestHandler } from "express";
import { createDeliveryZoneV100 } from "./controllers/create-delivery-zone.controller";
import { listAllDeliveryZonesV100 } from "./controllers/list-all-delivery-zones.controller";
import { updateDeliveryZoneV100 } from "./controllers/update-delivery-zone.controller";
import {
  deleteDeliveryZoneV100,
  deleteDeliveryZonesBatchV100,
} from "./controllers/delete-delivery-zone.controller";

const router = Router();

router.get("/", listAllDeliveryZonesV100 as RequestHandler);
router.post("/", createDeliveryZoneV100 as unknown as RequestHandler);
router.patch("/:id", updateDeliveryZoneV100 as unknown as RequestHandler);
router.delete("/:id", deleteDeliveryZoneV100 as unknown as RequestHandler);
router.delete(
  "/batch",
  deleteDeliveryZonesBatchV100 as unknown as RequestHandler,
);

export default router;
