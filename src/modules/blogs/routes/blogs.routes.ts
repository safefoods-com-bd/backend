import { RequestHandler, Router } from "express";
import { listAllBlogsV100 } from "../controllers/list-all-blogs.controller";
import { getSingleBlogV100 } from "../controllers/get-single-blog.controller";
import { createBlogV100 } from "../controllers/create-blog.controller";
import { updateBlogV100 } from "../controllers/update-blog.controller";
import {
  deleteBlogV100,
  deleteBlogsBatchV100,
} from "../controllers/delete-blog.controller";

const router = Router();

// Get all blogs with pagination
router.get("/", listAllBlogsV100 as RequestHandler);

// Get a single blog by slug
router.get("/:slug", getSingleBlogV100 as RequestHandler);

// Create a new blog
router.post("/", createBlogV100 as RequestHandler);

// Update an existing blog
router.patch("/:id", updateBlogV100 as RequestHandler);

// Delete a single blog
router.delete("/:id", deleteBlogV100 as RequestHandler);

// Batch delete blogs
router.delete("/batch", deleteBlogsBatchV100 as RequestHandler);

export default router;
