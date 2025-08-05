import { RequestHandler, Router } from "express";
import { listAllBannersV100 } from "./controllers/list-all-banners.controller";
import { getSingleBannerV100 } from "./controllers/get-single-banner.controller";
import { createBannerV100 } from "./controllers/create-banner.controller";
import { updateBannerV100 } from "./controllers/update-banner.controller";
import {
  deleteBannerV100,
  deleteBannersBatchV100,
} from "./controllers/delete-banner.controller";

const router = Router();

// Get all banners with pagination
router.get("/", listAllBannersV100 as unknown as RequestHandler);

// Get a single banner by ID
router.get("/:id", getSingleBannerV100 as unknown as RequestHandler);

// Create a new banner
router.post("/", createBannerV100 as unknown as RequestHandler);

// Update an existing banner
router.patch("/:id", updateBannerV100 as unknown as RequestHandler);

// Delete a single banner
router.delete("/:id", deleteBannerV100 as unknown as RequestHandler);

// Delete multiple banners in batch
router.delete("/batch", deleteBannersBatchV100 as unknown as RequestHandler);

export default router;
