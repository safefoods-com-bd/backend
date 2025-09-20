import { RequestHandler, Router } from "express";
import { listAllUnitsV100 } from "./controllers/list-all-units.controller";
import { createUnitV100 } from "./controllers/create-unit.controller";
import { updateUnitV100 } from "./controllers/update-unit.controller";
import {
  deleteUnitV100,
  deleteUnitsBatchV100,
} from "./controllers/delete-unit.controller";

const router = Router();

// Get all units with pagination
router.get("/", listAllUnitsV100 as RequestHandler);

// Create a new unit
router.post("/", createUnitV100 as RequestHandler);

// Update an existing unit
router.patch("/:id", updateUnitV100 as RequestHandler);

// Delete a single unit
router.delete("/:id", deleteUnitV100 as RequestHandler);

// Batch delete units
router.delete("/batch", deleteUnitsBatchV100 as RequestHandler);

export default router;
