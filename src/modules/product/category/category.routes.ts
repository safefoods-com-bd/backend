import { RequestHandler, Router } from "express";
import { listAllCategoriesV100 } from "./controllers/list-all-categories.controller";
import { getSingleCategoryV100 } from "./controllers/get-single-category.controller";
import { createCategoryV100 } from "./controllers/createCategory.controller";
import { updateCategoryV100 } from "./controllers/update-category.controller";
import {
  deleteCategoryV100,
  deleteCategoriesBatchV100,
} from "./controllers/delete-category.controller";

const router = Router();

// Get all categories with pagination
router.get("/", listAllCategoriesV100 as RequestHandler);

// Get a single category by ID
router.get("/:id", getSingleCategoryV100 as RequestHandler);

// Create a new category
router.post("/", createCategoryV100 as RequestHandler);

// Update an existing category
router.patch("/:id", updateCategoryV100 as RequestHandler);

// Delete a single category
router.delete("/:id", deleteCategoryV100 as RequestHandler);

// Batch delete categories
router.delete("/batch", deleteCategoriesBatchV100 as RequestHandler);

export default router;
