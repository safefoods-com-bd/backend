// colors
export const COLOR_ENDPOINTS = {
  LIST_ALL_COLORS: "GET /api/v1/colors",
  CREATE_COLOR: "POST /api/v1/colors",
  UPDATE_COLOR: "PATCH /api/v1/colors/:id",
  DELETE_COLOR: "DELETE /api/v1/colors/:id",
};

// brands
export const BRAND_ENDPOINTS = {
  LIST_ALL_BRANDS: "GET /api/v1/brands",
  CREATE_BRAND: "POST /api/v1/brands",
  UPDATE_BRAND: "PATCH /api/v1/brands/:id",
  DELETE_BRAND: "DELETE /api/v1/brands/:id",
};

// warehouses
export const WAREHOUSE_ENDPOINTS = {
  LIST_ALL_WAREHOUSES: "GET /api/v1/warehouses",
  CREATE_WAREHOUSE: "POST /api/v1/warehouses",
  UPDATE_WAREHOUSE: "PATCH /api/v1/warehouses/:id",
  DELETE_WAREHOUSE: "DELETE /api/v1/warehouses/:id",
  DELETE_WAREHOUSES_BATCH: "DELETE /api/v1/warehouses/batch",
};
