import { RequestHandler, Router } from "express";
import { listAllColorsV100 } from "./controllers/list-all-colors.controller";
import { createColorV100 } from "./controllers/create-a-color.controller";
import { PATCH } from "./controllers/update-a-color.controller";
import {
  deleteColorBatchV100,
  deleteColorSingleV100,
} from "./controllers/delete-a-color.controller";

const router = Router();
router.get("/", listAllColorsV100 as unknown as RequestHandler);
router.post("/", createColorV100 as unknown as RequestHandler);
router.patch("/", PATCH as unknown as RequestHandler);
router.delete("/", deleteColorSingleV100 as unknown as RequestHandler);
router.delete("/batch", deleteColorBatchV100 as unknown as RequestHandler);

export default router;
