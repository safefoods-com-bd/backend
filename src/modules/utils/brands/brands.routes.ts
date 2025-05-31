import { RequestHandler, Router } from "express";
import { listAllBrandsV100 } from "./controllers/list-all-brands.controller";
import { createBrandV100 } from "./controllers/create-a-brand.controller";
import {
  deleteBrandBatchV100,
  deleteBrandSingleV100,
} from "./controllers/delete-a-brand.controller";
import { updateBrandV100 } from "./controllers/update-a-brand.controller";

const router = Router();
router.get("/", listAllBrandsV100 as unknown as RequestHandler);
router.post("/", createBrandV100 as unknown as RequestHandler);
router.patch("/", updateBrandV100 as unknown as RequestHandler); // Assuming patch is for updating a brand
router.delete("/", deleteBrandSingleV100 as unknown as RequestHandler);
router.delete("/batch", deleteBrandBatchV100 as unknown as RequestHandler);

export default router;
