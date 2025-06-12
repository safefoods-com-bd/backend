import { RequestHandler, Router } from "express";
import { listAllVariantProductsV100 } from "./controllers/list-all-variant-products.controller";
import { createVariantProductV100 } from "./controllers/create-variant-product.controller";
import { getSingleVariantProductV100 } from "./controllers/get-single-variant-product.controller";
import { getVariantProductsByProductV100 } from "./controllers/get-variants-by-product.controller";
import { updateVariantProductV100 } from "./controllers/update-variant-product.controller";
import {
  deleteVariantProductSingleV100,
  deleteVariantProductBatchV100,
} from "./controllers/delete-variant-product.controller";

const router = Router();

// Get all variant products with pagination
router.get("/", listAllVariantProductsV100 as unknown as RequestHandler);

// Get a single variant product by ID
router.get("/:id", getSingleVariantProductV100 as RequestHandler);

// Get all variant products for a specific product
router.get(
  "/product/:productId",
  getVariantProductsByProductV100 as RequestHandler,
);

// Create a new variant product
router.post("/", createVariantProductV100 as unknown as RequestHandler);

// Update an existing variant product
router.patch("/", updateVariantProductV100 as unknown as RequestHandler);

// Delete a single variant product
router.delete("/", deleteVariantProductSingleV100 as unknown as RequestHandler);

// Batch delete variant products
router.delete(
  "/batch",
  deleteVariantProductBatchV100 as unknown as RequestHandler,
);

export default router;
