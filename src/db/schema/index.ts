export { default as generaSettings } from "./general-settings/general_settings";

// -------------user-management-----------------
export { default as permissionsTable } from "./user-management/permissions";
export { default as rolesTable } from "./user-management/roles";
export { default as permissionToRolesTable } from "./user-management/permissions_roles";
export { default as usersTable } from "./user-management/users";
export { default as profilesTable } from "./user-management/profile";
export { default as refreshTokensTable } from "./user-management/refresh_tokens";
export { default as accountsTable } from "./user-management/accounts";
export { default as usersToAccountsTable } from "./user-management/users_accounts";

// ------------general-settings-------------------
export { default as generalSettingsTable } from "./general-settings/general_settings";

// ------------utils------------------
export { default as mediaTable } from "./utils/media";
export { default as brandsTable } from "./utils/brands";
export { default as sizesTables } from "./utils/sizes";
export { default as colorsTable } from "./utils/colors";
export { default as unitsTable } from "./utils/units";

// -----------product management-----------------
// products
export { default as productsTable } from "./product-management/products/products";
export { default as variantProductsMediaTables } from "./product-management/products/variant_products_media";
export { default as variantProductsTable } from "./product-management/products/variant_products";
// categories
export { default as categoriesTable } from "./product-management/categories/categories";
export { default as categoryLevelsTable } from "./product-management/categories/category_levels";
// ------------order management-----------------
export { default as ordersTable } from "./order-management/orders";
export { default as addressesTable } from "./order-management/addresses";
export { default as couponsTable } from "./order-management/coupons";
export { default as paymentsTable } from "./order-management/payments";
export { default as paymentMethodsTable } from "./order-management/payment_methods";
export { default as productsOrdersTable } from "./order-management/products_orders";

// ------------stock management-----------------
export { default as stockTable } from "./stock-management/stocks";
export { default as warehouseTable } from "./stock-management/warehouses";
