export const permissionData = [
  // users
  { name: "create_user" },
  { name: "read_user" },
  { name: "update_user" },
  { name: "delete_user" },
  //roles
  { name: "create_role" },
  { name: "read_role" },
  { name: "update_role" },
  { name: "delete_role" },

  //permissions
  { name: "create_permission" },
  { name: "read_permission" },
  { name: "update_permission" },
  { name: "delete_permission" },

  // profile
  { name: "create_profile" },
  { name: "read_profile" },
  { name: "update_profile" },
  { name: "delete_profile" },

  //   admin
  { name: "administration" },
];

export const roleData = [{ name: "admin" }, { name: "user" }];

export const userData = [
  {
    email: "development@softeko.co",
    password: "admin123",
    registeredAt: new Date(),
    isVerified: true,
  },
];

export const serverData = [
  {
    name: "Server 1",
    ip: "192.168.1.1",
    port: 8080,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Server 2",
    ip: "192.168.1.2",
    port: 8080,
    status: "inactive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const categoryLevelsData = [
  // Main categories (Level 1)
  {
    id: "7474c266-4a58-4dad-b741-0daca67d34fa",
    title: "level_1",
    slug: "level_1",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    title: "level_2",
    slug: "level_2",
    parentId: "7474c266-4a58-4dad-b741-0daca67d34fa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1a6f01e6-de51-4b9c-b7ca-876a61bd462e",
    title: "level_3",
    slug: "level_3",
    parentId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const categoryData = [
  {
    id: "ff544434-5843-4609-8475-3fe7737dfca9",
    title: "Food",
    slug: "food",
    parentId: null,
    categoryLevelId: "7474c266-4a58-4dad-b741-0daca67d34fa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Fruits",
    slug: "fruits",
    parentId: "ff544434-5843-4609-8475-3fe7737dfca9",
    categoryLevelId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "892bbf1f-ea63-4812-8963-598f5cda0c16",
    title: "Vegetables",
    slug: "vegetables",
    parentId: "ff544434-5843-4609-8475-3fe7737dfca9",
    categoryLevelId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "05943de1-9614-4479-a0d6-2c378525b1ea",
    title: "Root Vegetables",
    slug: "root-vegetables",
    parentId: "892bbf1f-ea63-4812-8963-598f5cda0c16",
    categoryLevelId: "1a6f01e6-de51-4b9c-b7ca-876a61bd462e",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const productData = [
  {
    id: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    title: "Carrot",
    slug: "carrot",
    sku: "veg-001",
    description: "Fresh organic carrots",
    season: "winter",
    categoryId: "892bbf1f-ea63-4812-8963-598f5cda0c16",
  },
  {
    id: "c396f8a4-e020-483e-92ff-3642cdf8be65",
    title: "Tomato",
    slug: "tomato",
    sku: "veg-002",
    description: "Juicy red tomatoes",
    season: "summer",
    categoryId: "892bbf1f-ea63-4812-8963-598f5cda0c16",
  },
];

export const variantProductData = [
  {
    id: "21775847-f5d1-4079-bb7b-a267742b87b5",
    price: 10,
    originalPrice: 20,
    description: null,
    shortDescription: null,
    bestDeal: false,
    discountedSale: false,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    productId: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    colorId: null,
    unitId: null,
  },
];

export const warehouseData = [
  {
    id: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
    name: "warehouse-1",
    location: "Dhaka",
    contactNumber: "00000000000",
    email: "warehouse-1@safefoods.com.bd",
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const stockData = [
  {
    id: "f360e275-7142-4bb2-a44b-3f1148f3f074",
    quantity: 100,
    warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
    variantProductId: "21775847-f5d1-4079-bb7b-a267742b87b5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const orderData = [
  {
    id: "e5d14d6f-1640-426f-8673-9c808272079f",
    subTotal: "20.00",
    total: "20.00",
    afterDiscountTotal: "18.00",
    paymentStatus: "unpaid" as "paid" | "unpaid" | "refunded" | "failed",
    orderStatus: "pending" as
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled",
    userId: "d6caabd3-31a1-425a-97e4-32999663b474",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const productOrderData = [
  {
    id: "3cf14bc2-0e8e-4692-b152-13efc379c1d4",
    variantProductId: "21775847-f5d1-4079-bb7b-a267742b87b5",
    orderId: "e5d14d6f-1640-426f-8673-9c808272079f",
    price: "10.00",
    quantity: "2.00",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const couponsData = [
  {
    id: "07b36f9a-0703-41ea-b721-1686f2500da4",
    title: "Save 10%",
    discount: "10.00",
    discountType: "percentage" as "percentage" | "fixed_amount",
    validDate: "2025-12-31",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
