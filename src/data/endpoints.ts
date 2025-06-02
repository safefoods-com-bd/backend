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

// units
export const UNIT_ENDPOINTS = {
  LIST_ALL_UNITS: "GET /api/v1/units",
  CREATE_UNIT: "POST /api/v1/units",
  UPDATE_UNIT: "PATCH /api/v1/units/:id",
  DELETE_UNIT: "DELETE /api/v1/units/:id",
  DELETE_UNITS_BATCH: "DELETE /api/v1/units/batch",
};

// categories
export const CATEGORY_ENDPOINTS = {
  LIST_ALL_CATEGORIES: "GET /api/v1/categories",
  GET_SINGLE_CATEGORY: "GET /api/v1/categories/:id",
  CREATE_CATEGORY: "POST /api/v1/categories",
  UPDATE_CATEGORY: "PATCH /api/v1/categories/:id",
  DELETE_CATEGORY: "DELETE /api/v1/categories/:id",
  DELETE_CATEGORIES_BATCH: "DELETE /api/v1/categories/batch",
};

// products
export const PRODUCT_ENDPOINTS = {
  LIST_ALL_PRODUCTS: "GET /api/v1/products",
  GET_SINGLE_PRODUCT: "GET /api/v1/products/:id",
  CREATE_PRODUCT: "POST /api/v1/products",
  UPDATE_PRODUCT: "PATCH /api/v1/products/:id",
  DELETE_PRODUCT: "DELETE /api/v1/products/:id",
  DELETE_PRODUCTS_BATCH: "DELETE /api/v1/products/batch",
};
