import { Express } from "express";
import { permissionsRoutes } from "@/modules/user-management/permissions/index";
import { rolesRoutes } from "@/modules/user-management/roles/index";
import { authRoutes } from "@/modules/auth/index";
import { userRoutes } from "@/modules/user-management/users/index";
import { profileRoutes } from "@/modules/user-management/profile/index";
import { settingsRoutes } from "@/modules/general-settings/index";
import mediaRoutes from "@/modules/utils/media/media.routes";
import colorRoutes from "@/modules/utils/colors/colors.routes";
import brandRoutes from "@/modules/utils/brands/brands.routes";
import warehouseRoutes from "@/modules/stock-management/warehouses/warehouses.routes";

import { validateApiKey } from "./middleware/apiKeyMiddleware";
import { isProduction } from "./constants/variables";
export const registerRoutes = (app: Express) => {
  // isProduction && app.use(validateApiKey as any);

  // user management
  app.use("/api/user-management/permissions", permissionsRoutes);
  app.use("/api/user-management/roles", rolesRoutes);
  app.use("/api/user-management/users", userRoutes);
  app.use("/api/user-management/profile", profileRoutes);

  // auth
  app.use("/api/auth", authRoutes);

  //general-settings
  app.use("/api", settingsRoutes);
  app.use("/api/v1/media", mediaRoutes);
  app.use("/api/v1/colors", colorRoutes);
  app.use("/api/v1/brands", brandRoutes);

  // stock management
  app.use("/api/v1/warehouses", warehouseRoutes);
};
