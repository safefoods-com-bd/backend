import { RequestHandler, Router } from "express";
import { listAllMediaV100 } from "./controllers/list-all-media.controller";
import { createMediaV100 } from "./controllers/create-a-media.controller";
import {
  deleteMediaBatchV100,
  deleteMediaSingleV100,
} from "./controllers/delete-a-media.controller";

const router = Router();
router.get("/", listAllMediaV100 as RequestHandler);
router.post("/", createMediaV100 as RequestHandler);
router.delete("/", deleteMediaSingleV100 as RequestHandler);
router.delete("/batch", deleteMediaBatchV100 as RequestHandler);

export default router;
