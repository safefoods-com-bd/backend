import { RequestHandler, Router } from "express";
import { listAllProductsV100 } from "./controllers/list-all-products.controller";
import { createProductV100 } from "./controllers/create-product.controller";
import { getSingleProductV100 } from "./controllers/get-single-product.controller";
import { updateProductV100 } from "./controllers/update-product.controller";
import {
  deleteProductSingleV100,
  deleteProductBatchV100,
} from "./controllers/delete-product.controller";
import { listProductsByCategoryV100 } from "./controllers/get-products-by-category";
import { getSingleProductBySlugV100 } from "./controllers/get-single-product-by-slug.controller";
import { getRelatedProductsV100 } from "./controllers/get-related-products.controller";

const router = Router();

// Get all products with pagination
router.get("/", listAllProductsV100 as unknown as RequestHandler);

// Get a single product by ID
router.get("/:id", getSingleProductV100 as RequestHandler);

// Get a single product by slug
router.get(
  "/slug/:slug",
  getSingleProductBySlugV100 as unknown as RequestHandler,
);
// Get related products by slug
router.get(
  "/related/:slug",
  getRelatedProductsV100 as unknown as RequestHandler,
);

// Get products by category
router.get(
  "/category/:slug",
  listProductsByCategoryV100 as unknown as RequestHandler,
);

// Create a new product
router.post("/", createProductV100 as unknown as RequestHandler);

// Update an existing product
router.patch("/", updateProductV100 as unknown as RequestHandler);

// Delete a single product
router.delete("/", deleteProductSingleV100 as unknown as RequestHandler);

// Batch delete products
router.delete("/batch", deleteProductBatchV100 as unknown as RequestHandler);

export default router;
