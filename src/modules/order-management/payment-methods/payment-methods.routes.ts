import { RequestHandler, Router } from "express";
import { listAllPaymentMethodsV100 } from "./controllers/list-all-payment-methods.controller";
import { getSinglePaymentMethodV100 } from "./controllers/get-single-payment-method.controller";
import { createPaymentMethodV100 } from "./controllers/create-payment-method.controller";
import { updatePaymentMethodV100 } from "./controllers/update-payment-method.controller";
import {
  deletePaymentMethodSingleV100,
  deletePaymentMethodsBatchV100,
} from "./controllers/delete-payment-method.controller";

const router = Router();

// Get all payment methods with pagination
router.get("/", listAllPaymentMethodsV100 as RequestHandler);

// Get a single payment method by ID
router.get("/:id", getSinglePaymentMethodV100 as RequestHandler);

// Create a new payment method
router.post("/", createPaymentMethodV100 as RequestHandler);

// Update an existing payment method
router.patch("/:id", updatePaymentMethodV100 as RequestHandler);

// Delete a single payment method
router.delete("/:id", deletePaymentMethodSingleV100 as RequestHandler);

// Batch delete payment methods
router.delete("/batch", deletePaymentMethodsBatchV100 as RequestHandler);

export default router;
