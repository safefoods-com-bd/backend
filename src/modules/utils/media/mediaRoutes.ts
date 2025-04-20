import { Router } from "express";
import { ListAllMediaV100 } from "./controllers/list-all-media";
import { createMediaV100 } from "./controllers/create-a-media";
import {
  deleteMediaBatchV100,
  deleteMediaSingleV100,
} from "./controllers/delete-a-media";

const router = Router();
router.get("/", (req, res) => {
  ListAllMediaV100(req, res);
});
router.post("/", (req, res) => {
  createMediaV100(req, res);
});
router.delete("/", (req, res) => {
  deleteMediaSingleV100(req, res);
});
router.delete("/batch", (req, res) => {
  deleteMediaBatchV100(req, res);
});

export default router;
