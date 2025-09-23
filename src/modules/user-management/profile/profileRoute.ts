import { RequestHandler, Router } from "express";

import {
  createProfile,
  deleteProfile,
  getUsersProfile,
  updateProfile,
} from "./profileController";
import {
  DELETE_PROFILE,
  READ_PROFILE,
  UPDATE_PROFILE,
} from "@/constants/permissionsAndRoles";
import { checkPermissionAndOwnershipMiddleware } from "@/middleware/permissionMiddleware";

const router = Router();

router.post("/", (req, res) => {
  createProfile(req, res);
});

router.get(
  "/:userId",
  // checkPermissionAndOwnershipMiddleware(READ_PROFILE) as RequestHandler,
  (req, res) => {
    getUsersProfile(req, res);
  },
);

router.patch(
  "/:userId",
  // checkPermissionAndOwnershipMiddleware(UPDATE_PROFILE) as RequestHandler,
  (req, res) => {
    updateProfile(req, res);
  },
);

router.delete(
  "/:userId",
  checkPermissionAndOwnershipMiddleware(DELETE_PROFILE) as RequestHandler,
  (req, res) => {
    deleteProfile(req, res);
  },
);
export default router;
