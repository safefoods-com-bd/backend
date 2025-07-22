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

export const accountData = [
  {
    provider_name: "traditional",
  },
  {
    provider_name: "mobile_otp",
  },
  {
    provider_name: "google",
  },
  {
    provider_name: "facebook",
  },
  {
    provider_name: "apple",
  },
  {
    provider_name: "github",
  },
];

export const userData = [
  {
    email: "softpiper.dev@softpiper.com",
    password: "admin123",
    registeredAt: new Date(),
    isVerified: true,
  },
];

export const mediaData = [
  {
    id: "97fc7d67-007e-42f8-aecb-3ce0729421f4",
    title: "Safe Premium Milk(1L)",
    url: "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746604594%2Fsafefoods%2Fl6gt9cdmhrmvu3ozrohc.png&w=640&q=75",
  },
  {
    id: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
    title: "Desi Beef regular per kg",
    url: "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605224%2Fsafefoods%2Fdbtlwhttruwqn7ckunah.png&w=640&q=75",
  },
  {
    id: "5d396082-4972-49de-8128-464ff02d748d",
    title: "Boneless Beef-1kg",
    url: "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1746605231%2Fsafefoods%2Fzddhpxkzwvull3i9xlof.png&w=640&q=75",
  },
  {
    id: "bf28d2c1-cb5e-4b09-b23c-04c028999417",
    title: "Safe Broiler",
    url: "https://safefoods.com.bd/_next/image?url=http%3A%2F%2Fres.cloudinary.com%2Fdymnymsph%2Fimage%2Fupload%2Fv1751343252%2Fsafefoods%2Fgiyxzxzd0sf75lrrw0a7.webp&w=640&q=75",
  },
];

export const unitData = [
  {
    id: "8ec1d954-1814-46cf-981b-2d02ed3cc2ea",
    code: "1kg",
    title: "1kg",
    baseUnit: "1kg",
    operator: null,
    operationValue: null,
  },
  {
    id: "00abdaf6-f4c5-48b6-a1e4-4bd15842f093",
    code: "2kg",
    title: "2kg",
    baseUnit: "1kg",
    operator: "*",
    operationValue: "2",
  },
  {
    id: "6e700908-6061-4aed-8d91-9f77f198f213",
    code: "5kg",
    title: "5kg",
    baseUnit: "1kg",
    operator: "*",
    operationValue: "5",
  },
  {
    id: "88824719-0cbe-4f8f-a7da-375494f4de23",
    code: "1L",
    title: "1L",
    baseUnit: "1L",
    operator: null,
    operationValue: null,
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
    title: "Proteins",
    slug: "proteins",
    parentId: null,
    categoryLevelId: "7474c266-4a58-4dad-b741-0daca67d34fa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Meat",
    slug: "meat",
    parentId: "ff544434-5843-4609-8475-3fe7737dfca9",
    categoryLevelId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "892bbf1f-ea63-4812-8963-598f5cda0c16",
    title: "Dairy",
    slug: "dairy",
    parentId: "ff544434-5843-4609-8475-3fe7737dfca9",
    categoryLevelId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "05943de1-9614-4479-a0d6-2c378525b1ea",
    title: "Fish",
    slug: "fish",
    parentId: "ff544434-5843-4609-8475-3fe7737dfca9",
    categoryLevelId: "1a6f01e6-de51-4b9c-b7ca-876a61bd462e",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const productData = [
  {
    id: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    title: "Desi Beef regular per kg",
    slug: "desi-beef-regular-per-kg",
    sku: "meat-001",
    description: "Desi origin, Actual weight, 25% bone and fat maximum",
    season: null,
    isActive: true,
    isDeleted: false,
    categoryId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    brandId: null,
  },
  {
    id: "909b455c-5054-4b1e-9d4b-56f206da3d54",
    title: "Safe Premium Milk(1L)",
    slug: "safe-premium-milk(1l)",
    sku: "dairy-001",
    season: null,
    isActive: true,
    isDeleted: false,
    categoryId: "ff544434-5843-4609-8475-3fe7737dfca9",
    brandId: null,
  },
];

export const variantProductData = [
  {
    id: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
    price: 4000,
    originalPrice: 4000,
    description: "প্রতি সোমবার ও বৃহস্পতিবার গরু জবাই করা হয়।",
    shortDescription: null,
    bestDeal: false,
    discountedSale: false,
    isActive: true,
    isDeleted: false,
    productId: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    colorId: null,
    unitId: "8ec1d954-1814-46cf-981b-2d02ed3cc2ea",
  },
  {
    id: "e95f72f8-cdfc-4aa4-8595-2a60a6149397",
    price: 800,
    originalPrice: 800,
    description: "প্রতি সোমবার ও বৃহস্পতিবার গরু জবাই করা হয়।",
    shortDescription: "",
    bestDeal: false,
    discountedSale: false,
    initialStock: 100,
    isActive: true,
    isDeleted: false,
    productId: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    unitId: "8ec1d954-1814-46cf-981b-2d02ed3cc2ea",
  },
  {
    id: "0bb99001-7c01-45c5-b4aa-b164854a6413",
    price: 1600,
    originalPrice: 1600,
    description: "প্রতি সোমবার ও বৃহস্পতিবার গরু জবাই করা হয়।",
    shortDescription: "",
    bestDeal: false,
    discountedSale: false,
    isActive: true,
    isDeleted: false,
    productId: "20e4cf65-ba20-4804-a0ee-b81f4fc2ea3d",
    colorId: null,
    unitId: "00abdaf6-f4c5-48b6-a1e4-4bd15842f093",
  },
  {
    id: "e9caf159-e9a2-4301-a5c4-944fbdf334ad",
    price: 110,
    originalPrice: 120,
    description: "fresh milk",
    shortDescription: "",
    bestDeal: false,
    discountedSale: false,
    initialStock: 100,
    isActive: true,
    isDeleted: false,
    productId: "909b455c-5054-4b1e-9d4b-56f206da3d54",
    unitId: "88824719-0cbe-4f8f-a7da-375494f4de23",
  },
];

export const variantProductMediaData = [
  {
    id: "c1d37851-9779-483f-a86d-57c7b5515d0b",
    variantProductId: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
    mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
  },
  {
    id: "fdc2e021-a9c6-4e2f-87b3-2a06c7fb6d85",
    variantProductId: "e95f72f8-cdfc-4aa4-8595-2a60a6149397",
    mediaId: "23f5ec04-5cd7-415e-8559-6d67005e3e57",
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

export const deliveryZoneData = [
  {
    id: "d6caabd3-31a1-425a-97e4-32999663b474",
    areaName: "Khilgaon",
    deliveryCharge: 50,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f360e275-7142-4bb2-a44b-3f1148f3f074",
    areaName: "Dhanmondi",
    deliveryCharge: 70,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "e5d14d6f-1640-426f-8673-9c808272079f",
    areaName: "Gulshan",
    deliveryCharge: 100,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
