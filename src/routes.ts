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
import unitsRoutes from "@/modules/utils/units/units.routes";
import categoryLevelsRoutes from "@/modules/product/category-level/categoryLevel.routes";
import categoryRoutes from "@/modules/product/category/category.routes";
import productsRoutes from "@/modules/product/products/products.routes";
import paymentMethodsRoutes from "@/modules/order-management/payment-methods/payment-methods.routes";
import addressRoutes from "@/modules/order-management/addresses/addresses.routes";
import stocksRoutes from "@/modules/stock-management/stocks/stocks.routes";
import orderRoutes from "@/modules/order-management/orders/orders.routes";
import couponRoutes from "@/modules/order-management/coupon/coupon.routes";
import deliveryZonesRoutes from "@/modules/order-management/delivery-zones/delivery-zones.routes";
import { cartRoutes } from "@/modules/order-management/cart";

// import { validateApiKey } from "./middleware/apiKeyMiddleware";
// import { isProduction } from "./constants/variables";
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
  app.use("/api/v1/units", unitsRoutes);

  // stock management
  app.use("/api/v1/warehouses", warehouseRoutes);

  // product management
  app.use("/api/v1/category-levels", categoryLevelsRoutes);
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/products", productsRoutes);

  // order management
  app.use("/api/v1/payment-methods", paymentMethodsRoutes);
  app.use("/api/v1/addresses", addressRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/delivery-zones", deliveryZonesRoutes);
  app.use("/api/v1/cart", cartRoutes);

  //stock management
  app.use("/api/v1/stocks", stocksRoutes);
};
