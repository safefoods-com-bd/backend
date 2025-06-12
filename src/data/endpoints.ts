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

// variant products
export const VARIANT_PRODUCT_ENDPOINTS = {
  LIST_ALL_VARIANT_PRODUCTS: "GET /api/v1/variant-products",
  GET_SINGLE_VARIANT_PRODUCT: "GET /api/v1/variant-products/:id",
  GET_VARIANT_PRODUCTS_BY_PRODUCT:
    "GET /api/v1/variant-products/product/:productId",
  CREATE_VARIANT_PRODUCT: "POST /api/v1/variant-products",
  UPDATE_VARIANT_PRODUCT: "PATCH /api/v1/variant-products/:id",
  DELETE_VARIANT_PRODUCT: "DELETE /api/v1/variant-products/:id",
  DELETE_VARIANT_PRODUCTS_BATCH: "DELETE /api/v1/variant-products/batch",
};

// addresses
export const ADDRESS_ENDPOINTS = {
  LIST_ALL_ADDRESSES: "GET /api/v1/addresses",
  GET_SINGLE_ADDRESS: "GET /api/v1/addresses/:id",
  CREATE_ADDRESS: "POST /api/v1/addresses",
  UPDATE_ADDRESS: "PATCH /api/v1/addresses/:id",
  DELETE_ADDRESS: "DELETE /api/v1/addresses/:id",
  DELETE_ADDRESSES_BATCH: "DELETE /api/v1/addresses/batch",
  GET_USER_ADDRESSES: "GET /api/v1/addresses/user/:userId",
};

// payment methods
export const PAYMENT_METHOD_ENDPOINTS = {
  LIST_ALL_PAYMENT_METHODS: "GET /api/v1/payment-methods",
  GET_SINGLE_PAYMENT_METHOD: "GET /api/v1/payment-methods/:id",
  CREATE_PAYMENT_METHOD: "POST /api/v1/payment-methods",
  UPDATE_PAYMENT_METHOD: "PATCH /api/v1/payment-methods/:id",
  DELETE_PAYMENT_METHOD: "DELETE /api/v1/payment-methods/:id",
  DELETE_PAYMENT_METHODS_BATCH: "DELETE /api/v1/payment-methods/batch",
};
