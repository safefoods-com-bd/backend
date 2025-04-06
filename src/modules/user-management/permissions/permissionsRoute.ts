import { Router } from "express";

import {
  createPermissions,
  getSinglePermission,
  listAllPermissions,
  updateSinglePermission,
} from "./permissionsController";

const router = Router();

router.get("/", (req, res) => {
  listAllPermissions(req, res);
});
router.get("/:id", (req, res) => {
  getSinglePermission(req, res);
});
router.post("/", (req, res) => {
  createPermissions(req, res);
});
router.patch("/:id", (req, res) => {
  updateSinglePermission(req, res);
});

export default router;
