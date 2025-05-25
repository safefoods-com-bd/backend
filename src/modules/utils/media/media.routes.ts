import { RequestHandler, Router } from "express";
import { listAllMediaV100 } from "./controllers/list-all-media.controller";
import { createMediaV100 } from "./controllers/create-a-media.controller";
import {
  deleteMediaBatchV100,
  deleteMediaSingleV100,
} from "./controllers/delete-a-media.controller";

const router = Router();
router.get("/v1/", listAllMediaV100 as RequestHandler);
router.post("/v1/", createMediaV100 as RequestHandler);
router.delete("/v1/", deleteMediaSingleV100 as RequestHandler);
router.delete("/v1/batch", deleteMediaBatchV100 as RequestHandler);

export default router;
