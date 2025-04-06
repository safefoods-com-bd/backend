import {
  listAllRoles,
  createRoles,
  updateSingleRole,
  deleteSingleRole,
  getSingleRole,
} from "./rolesController";
import rolesRoutes from "./rolesRoute";
import { createRoleSchema } from "./rolesValidation";

export {
  listAllRoles,
  createRoles,
  updateSingleRole,
  deleteSingleRole,
  getSingleRole,
  rolesRoutes,
  createRoleSchema,
};
