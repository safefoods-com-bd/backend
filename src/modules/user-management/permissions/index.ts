import {
  listAllPermissions,
  createPermissions,
  getSinglePermission,
  updateSinglePermission,
} from "./permissionsController";
import permissionsRoutes from "./permissionsRoute";
import { createPermissionSchema } from "./permissionsValidation";

export {
  listAllPermissions,
  createPermissions,
  getSinglePermission,
  permissionsRoutes,
  createPermissionSchema,
  updateSinglePermission,
};
