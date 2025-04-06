import { RequestHandler, Router } from "express";
import {
  createUser,
  getSingleUser,
  getUserPermissions,
  listAllUsers,
} from "./usersController";
import { CREATE_ROLE } from "@/constants/permissionsAndRoles";
import { checkPermissionAndOwnershipMiddleware } from "@/middleware/permissionMiddleware";
import { rateLimitingOnIndividualUserAndIp } from "@/middleware/rateLimiting";

const router = Router();
router.get("/", (req, res) => {
  listAllUsers(req, res);
});
router.get(
  "/:id",
  rateLimitingOnIndividualUserAndIp({ time: 10, maxRequests: 5 }),
  checkPermissionAndOwnershipMiddleware(CREATE_ROLE) as RequestHandler,
  (req, res) => {
    getSingleUser(req, res);
  },
);
router.post("/", (req, res) => {
  createUser(req, res);
});

router.get("/:id/permissions", (req, res) => {
  getUserPermissions(req, res);
});

export default router;
