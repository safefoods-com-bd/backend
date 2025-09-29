import { RequestHandler, Router } from "express";
import { createOrderV100 } from "./controllers/create-order.controller";
import { getUserOrdersV100 } from "./controllers/get-order.controller";
import { updateOrderV100 } from "./controllers/update-order.controller";
import {
  deleteOrderV100,
  deleteOrdersBatchV100,
} from "./controllers/delete-order.controller";
import { createGuestUserOrderV100 } from "./controllers/create-guest-order.controller";
import { getAllOrdersV100 } from "./controllers/list-all-orders.controller";

const router = Router();

// Get all orders
router.get("/", getAllOrdersV100 as RequestHandler);

// Get all orders for a specific user with pagination
router.get("/user/:userId", getUserOrdersV100 as RequestHandler);

// Create a new order
router.post("/", createOrderV100 as RequestHandler);

// Create a new Guest User Order
router.post("/guest", createGuestUserOrderV100 as RequestHandler);

// Update an existing order
router.patch("/:id", updateOrderV100 as RequestHandler);

// Delete a single order
router.delete("/", deleteOrderV100 as RequestHandler);

// Delete multiple orders in batch
router.delete("/batch", deleteOrdersBatchV100 as RequestHandler);

export default router;
