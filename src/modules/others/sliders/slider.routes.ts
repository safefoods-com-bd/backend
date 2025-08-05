import { RequestHandler, Router } from "express";
import { listAllSlidersV100 } from "./controllers/list-all-sliders.controller";
import { getSingleSliderV100 } from "./controllers/get-single-slider.controller";
import { createSliderV100 } from "./controllers/create-slider.controller";
import { updateSliderV100 } from "./controllers/update-slider.controller";
import {
  deleteSliderV100,
  deleteSlidersBatchV100,
} from "./controllers/delete-slider.controller";

const router = Router();

// Get all sliders with pagination
router.get("/", listAllSlidersV100 as unknown as RequestHandler);

// Get a single slider by ID
router.get("/:id", getSingleSliderV100 as unknown as RequestHandler);

// Create a new slider
router.post("/", createSliderV100 as unknown as RequestHandler);

// Update an existing slider
router.patch("/:id", updateSliderV100 as unknown as RequestHandler);

// Delete a single slider
router.delete("/:id", deleteSliderV100 as unknown as RequestHandler);

// Delete multiple sliders in batch
router.delete("/batch", deleteSlidersBatchV100 as unknown as RequestHandler);

export default router;
