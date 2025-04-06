import { RequestHandler, Router } from "express";

import { checkPermission } from "@/lib/checkPermissionFunctions";
import { ADMIN_PERMISSION } from "@/constants/permissionsAndRoles";
import { updateGeneralSettingsV100 } from "../controllers/settingsController";

const router = Router();

router.patch(
  "/v1.0.0/general-settings",
  checkPermission(ADMIN_PERMISSION) as RequestHandler,
  (req, res) => {
    updateGeneralSettingsV100(req, res);
  },
);

router.get("/v1.0.0/general-settings", (req, res) => {
  res.status(200).json({
    message: "This is the general settings route",
    version: "1.0.0",
    data: {
      appName: "My App",
      appVersion: "1.0.0",
      appDescription: "This is my app",
    },
  });
});

export default router;
