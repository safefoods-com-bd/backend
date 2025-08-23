import { RequestHandler, Router } from "express";
import { createBlogCategoryV100 } from "./controllers/create-blog-category.controller";
import {
  getBlogCategoriesV100,
  getBlogCategoryByIdV100,
} from "./controllers/get-blog-categories.controller";
import { updateBlogCategoryV100 } from "./controllers/update-blog-category.controller";
import {
  deleteBlogCategoryV100,
  deleteBlogCategoriesBatchV100,
} from "./controllers/delete-blog-category.controller";

const router = Router();

// Get all blog categories with pagination
router.get("/", getBlogCategoriesV100 as RequestHandler);

// Get a single blog category by ID
router.get("/:id", getBlogCategoryByIdV100 as RequestHandler);

// Create a new blog category
router.post("/", createBlogCategoryV100 as RequestHandler);

// Update an existing blog category
router.patch("/:id", updateBlogCategoryV100 as RequestHandler);

// Delete a single blog category
router.delete("/:id", deleteBlogCategoryV100 as RequestHandler);

// Delete multiple blog categories
router.delete("/batch", deleteBlogCategoriesBatchV100 as RequestHandler);

export default router;
