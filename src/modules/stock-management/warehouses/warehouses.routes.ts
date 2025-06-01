import { RequestHandler, Router } from "express";
import { listAllWarehousesV100 } from "./controllers/list-all-warehouses.controller";
import { createWarehouseV100 } from "./controllers/create-warehouse.controller";
import { updateWarehouseV100 } from "./controllers/update-warehouse.controller";
import {
  deleteWarehouseV100,
  deleteWarehousesBatchV100,
} from "./controllers/delete-warehouse.controller";

const router = Router();

// Get all warehouses with pagination
router.get("/", listAllWarehousesV100 as RequestHandler);

// Create a new warehouse
router.post("/", createWarehouseV100 as RequestHandler);

// Update an existing warehouse
router.patch("/", updateWarehouseV100 as RequestHandler);

// Delete a single warehouse
router.delete("/", deleteWarehouseV100 as RequestHandler);

// Batch delete warehouses
router.delete("/batch", deleteWarehousesBatchV100 as RequestHandler);

export default router;
