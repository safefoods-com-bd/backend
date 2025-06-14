import { RequestHandler, Router } from "express";

import { updateStockV100 } from "./controllers/update-stock.controller";
import { createStockV100 } from "./controllers/create-stocks.controller";
import { getAllStocksV100 } from "./controllers/get-stocks.controller";
import {
  deleteStocksBatchV100,
  deleteStockV100,
} from "./controllers/delete-stocks.controller";

const router = Router();

// Get all stocks for a specific warehouse with pagination
router.get("/warehouse/:warehouseId", getAllStocksV100 as RequestHandler);

// Create a new stock
router.post("/", createStockV100 as RequestHandler);

// Update an existing stock
router.patch("/:id", updateStockV100 as RequestHandler);

// Delete a single stock
router.delete("/", deleteStockV100 as RequestHandler);

// Delete multiple stocks in batch
router.delete("/batch", deleteStocksBatchV100 as RequestHandler);

export default router;
