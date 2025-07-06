import { RequestHandler, Router } from "express";
import { listMediaByVariantProductV100 } from "./controllers/list-media-by-variant-product.controller";
import { addMediaToVariantProductV100 } from "./controllers/add-media-to-variant-product.controller";
import { updateMediaForVariantProductV100 } from "./controllers/update-media-to-variant-product.controller";
import {
  deleteMediaFromVariantProductV100,
  deleteAllMediaFromVariantProductV100,
} from "./controllers/delete-media-from-variant-product.controller";

const router = Router();

// Get all media for a variant product
router.get(
  "/variant/:variantProductId",
  listMediaByVariantProductV100 as unknown as RequestHandler,
);

// Add media to a variant product
router.post("/", addMediaToVariantProductV100 as unknown as RequestHandler);

// Update media for a variant product
router.patch(
  "/",
  updateMediaForVariantProductV100 as unknown as RequestHandler,
);

// Delete a specific media from a variant product
router.delete(
  "/",
  deleteMediaFromVariantProductV100 as unknown as RequestHandler,
);

// Delete all media from a variant product
router.delete(
  "/variant/:variantProductId",
  deleteAllMediaFromVariantProductV100 as unknown as RequestHandler,
);

export default router;
