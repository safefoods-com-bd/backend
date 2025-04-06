import settingsRoutes from "./routes/settingsRoute";
import { updateGeneralSettingsSchema } from "./generalSettingsValidation";
import { updateGeneralSettingsV100 } from "./controllers/settingsController";

export {
  updateGeneralSettingsV100,
  settingsRoutes,
  updateGeneralSettingsSchema,
};
