import { Router, RequestHandler } from "express";
import {
  createRoles,
  deleteSingleRole,
  getSingleRole,
  listAllRoles,
  updateSingleRole,
} from "./rolesController";
import { CREATE_ROLE } from "@/constants/permissionsAndRoles";
import { checkPermission } from "@/lib/checkPermissionFunctions";

const router = Router();
router.get("/", checkPermission(CREATE_ROLE) as RequestHandler, (req, res) => {
  listAllRoles(req, res);
});
router.get("/:id", (req, res) => {
  getSingleRole(req, res);
});

router.post("/", checkPermission(CREATE_ROLE) as RequestHandler, (req, res) => {
  createRoles(req, res);
});
router.patch("/:id", (req, res) => {
  updateSingleRole(req, res);
});
router.delete("/:id", (req, res) => {
  deleteSingleRole(req, res);
});
export default router;
