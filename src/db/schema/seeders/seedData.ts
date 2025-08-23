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
    id: "90073e5c-30b4-471f-bf09-293a527daa95",
    email: "softpiper.dev@softpiper.com",
    password: "admin123",
    registeredAt: new Date(),
    isVerified: true,
    providerName: "traditional",
  },
];

export const addressesData = [
  {
    id: "f37ca2fd-cec7-48d9-b4e0-114c19b3c276",
    userId: "90073e5c-30b4-471f-bf09-293a527daa95",
    flatNo: "4c",
    floorNo: "3",
    addressLine: "Shahjahanpur",
    name: "arafat",
    phoneNo: "01676042170",
    deliveryNotes: "the address is near Amtola Masjid",
    city: "Dhaka",
    state: "Dhaka",
    country: "Bangladesh",
    postalCode: "1205",
    isActive: true,
  },
  {
    id: "2d1eebd1-334c-4721-88e0-52fbb878932d",
    userId: "90073e5c-30b4-471f-bf09-293a527daa95",
    flatNo: "4c",
    floorNo: "3",
    addressLine: "Hazaribagh",
    name: "arafat",
    phoneNo: "01676042170",
    deliveryNotes: "the address is near Hazaribagh Park",
    city: "Dhaka",
    state: "Dhaka",
    country: "Bangladesh",
    postalCode: "1217",
    isActive: false,
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
  // Slider images
  {
    id: "2c488b28-db26-4381-9209-4b7555ff8431",
    title: "safe omega-3 broiler",
    url: "https://res.cloudinary.com/dymnymsph/image/upload/v1752569655/safefoods/ybsinftr0b3izioyrxow.png",
  },
  // Banner images
  {
    id: "8c384d07-a597-4c64-a421-2c0503dda2c3",
    title: "Safe Egg",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1752568607/safefoods/slkwfg82txztkdjhd4sm.png",
  },
  {
    id: "15ae9634-fbfb-4bf8-b1b9-1ebbe7f31518",
    title: "Safe Broiler",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1752568640/safefoods/gm5pkbjnzotufnova9yu.png",
  },
  {
    id: "4dee4f37-6732-4af5-b179-9512845858a7",
    title: "Omega-3 Broiler",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1752568679/safefoods/gmpio2pnmi6cwyatxjy1.png",
  },
  {
    id: "632e3aeb-43a8-4165-a266-2009f4947d5f",
    title: "Omega-3 Egg",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1752568782/safefoods/xfefedgstnnaq4tobunx.png",
  },
  /// blogs
  {
    id: "49891985-8074-45b8-8c3c-b87ea7a1ea81",
    title: "organic-chicken-egg",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1697759639/safefoods/yhfifyae10ohhi61vtxv.png",
  },
  {
    id: "6abc17cf-2e2a-40c3-bdaf-3cef44fafe4d",
    title: "when-take-honey",
    url: "http://res.cloudinary.com/dymnymsph/image/upload/v1697722384/safefoods/mxtlvpe0athswnymsagr.png",
  },
];

export const slidersData = [
  {
    mediaId: "2c488b28-db26-4381-9209-4b7555ff8431",
    title: "safe omega-3 broiler",
  },
];

export const bannersData = [
  {
    mediaId: "8c384d07-a597-4c64-a421-2c0503dda2c3",
    title: "Safe Egg",
    variantProductId: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
  },
  {
    mediaId: "15ae9634-fbfb-4bf8-b1b9-1ebbe7f31518",
    title: "Safe Broiler",
    variantProductId: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
  },
  {
    mediaId: "4dee4f37-6732-4af5-b179-9512845858a7",
    title: "Omega-3 Broiler",
    variantProductId: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
  },
  {
    mediaId: "632e3aeb-43a8-4165-a266-2009f4947d5f",
    title: "Omega-3 Egg",
    variantProductId: "66c423c5-8789-45a3-bcbd-8ce0a9d3e6fb",
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

  {
    id: "6f985180-3d55-4a30-8973-c52ae37759a2",
    title: "Daily Essentials",
    slug: "daily-essentials",
    description: "",
    categoryLevelId: "7474c266-4a58-4dad-b741-0daca67d34fa",
    parentId: null,
    mediaId: null,
    isActive: true,
  },
  {
    id: "db91e54f-7e75-49b7-b6b7-3fe5ddc579eb",
    title: "Oil",
    slug: "oil",
    description: "",
    categoryLevelId: "65f89dd4-3dab-4832-b1ff-83a7178d1561",
    parentId: "6f985180-3d55-4a30-8973-c52ae37759a2",
    mediaId: null,
    isActive: true,
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
    initialStock: 100,
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
    initialStock: 100,
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
    discountType: "percentage" as "percentage" | "fixed",
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

export const paymentMethodData = [
  {
    id: "c1d37851-9779-483f-a86d-57c7b5515d0b",
    title: "Cash on Delivery",
    description: "Pay with cash upon delivery of your order.",
    isActive: true,
    isDeleted: false,
  },
  {
    id: "fdc2e021-a9c6-4e2f-87b3-2a06c7fb6d85",
    title: "bKash",
    description: "Pay with bKash.",
    isActive: true,
    isDeleted: false,
  },
  {
    id: "c1d37851-9779-483f-a86d-57c7b5515d0b",
    title: "Nagad",
    description: "Pay with Nagad.",
    isActive: true,
    isDeleted: false,
  },
];

export const blogsCategoryData = [
  {
    id: "7c0f3350-1974-41c2-a0d5-62a1a0648d43",
    title: "Honey",
    slug: "honey",
  },
  {
    id: "ccb6f5d2-8cab-4c65-91c6-fef96700aec4",
    title: "Dairy",
    slug: "dairy",
  },
];

export const blogsData = [
  {
    id: "4854c493-5b30-4159-8aee-d1994b82f7f4",
    title: "অর্গানিক মাংস বা ডিম(মনভোলানো বিজ্ঞাপন বনাম বাস্তবতা)",
    slug: "organic-chicken-egg",
    content:
      "<p><span >অর্গানিক প্রোডাক্ট শুনতেই খুব ভালো লাগে, তাই না? মনে হয় কেমন যেন, এর সবকিছু সতেজ আর প্রাকৃতিক। কিন্তু শুনতে তিতা হলেও এটাই সত্য যে, আসলে গ্রাহক হিসাবে অর্গানিক নামের আড়ালে আমরা প্রকৃত অর্গানিক প্রোডাক্টটি হাতের কাছে পাই না। বরং অতি সাধারণ কিছু ব্যবস্থা গ্রহণ করেই তার উপর লেবেল লাগানো হয় অর্গানিক প্রোডাক্ট! সুস্বাস্থ্য নিয়ে কৌতূহলী মানুষরা এসব </span></p><p><span >প্রোডাক্টের মুখরোচক বিজ্ঞাপন দেখে তা কিনেও নেন, ফলে তারা দিন কে দিন প্রতারনার স্বীকার হচ্ছবাংলাদেশী মনোভাবে আমরা যা বুঝি তা হলো “গ্রাম থেকে এসেছে মানেই অর্গানিক”, “পশু/পাখি কে কোম্পানী লেবেল দেয়া জৈবিক খাদ্য দিয়েই অর্গানিক” “আবার জৈব সার দিয়ে চাষ করলেই তা অর্গানিক” দিন শেষে এসবের ফায়দা নিয়ে অনেকেই এগুলো বাজারজাত করে সাধারণ জনগণকে বোকাও বানাচকৃষি বিষয়ক উচ্চতর পড়াশোনা করার সুবাদে প্রকৃত অর্গানিক প্রোডাক্ট সম্পর্কে বিশদ জানার সুযোগ হয়েছিল। সে থেকেই বলি, আসলে কিন্তু অর্গানিক বলতে যা বুঝায় তা হলো, উৎপাদন থেকে শুরু করে খাবার আগে পর্যন্ত পুরোটাই জৈবিক হতে হবে। যেমন ধরুন মুরগির ডিম বা মাংস উৎপাদন করতে গিয়ে, প্রথমেই মুরগির বাচ্চার(জন্মের ২৪ ঘণ্টার মধ্যেই) লালন পালন শুরু হতে হবে অর্গানিক উপায়ে এবং সাথে তার খাবারসহ অন্যান্য বিষয়গুলো অর্গানিক গাইডলাইন মেনে চলেই করপালনকৃত মুরগিকে কোনো আবদ্ধ অবস্থায় রাখা যাবেনা বরং প্রাকৃতিকভাবে ছেড়ে দিয়ে পালন করতে হবে। সেক্ষেত্রে প্রচুর পরিমাণে প্রাকৃতিক চারণ জমির দরকার যা আমাদের দেশে ব্যবস্থা করা খুবই দুরূহ ব্যাপার। আবার মুরগির খাবার হিসাবে যা ব্যবহার করা হচ্ছে সেটি যে মাটিতে ফসল হিসাবে উৎপাদিত হয় তাতেও কোনো ধরণের রাসায়নিক কেমিক্যাল কোন্টামিনেশন থাকবে না, এমনকি যে পানি চাষ হিসাবে দেয়া হবে তাতেও থাকবে না, জৈব সার ব্যবহার করলে সম্পূর্ণ ভেজালমুক্ত হতে হবে। আমাদের দেশের অবস্থা অনুসারে এই পুরো চেইনটি নিয়ন্ত্রণ করা একপ্রকার অসম্ভবই বটে। কারণ মুরগির খাবারটি জৈব সার ব্যবহার করে ভেজাল মুক্ত ভাবে চাষ করলেও তা অন্তত তিন বছর পর্যন্ত এভাবে উৎপাদন করার পর তা অর্গানিক খাবার বলার যোগ্যতা পাবে। বুঝতেই পারছেন প্রক্রিয়াটি! এছাড়াও খাবার উৎপাদনের জমিতে জৈব বালাইনাশক ব্যবহার করতে হবে এবং ফসল পরিপক্ক হলেই কেবল গাছ থেকে সংগ্রহ করে তা কোনো ধরণের রাসায়নিক সংস্পর্শে না এনেই গ্রাহকের কাছে দিতে হবে। আবার শুধু নিজের ফার্মকে অর্গানিক করলেই হবে না বরং পাশের জমি যে রাসায়নিক সার ও স্প্রে এর বন্যা করে দিলে তা আর অর্গানিক দাবি করা যাবে না, আর সে খাবার মুরগিকে দিলে তো মুরগির অর্গানিক ডিম বা মাংস বলার প্রশ্নই উঠে না। মোট কথা মুরগির বাচ্চা উৎপাদন থেকে শুরু করে এর ডিম বা মাংস বাজাতকরণের মাঝে, লালন পালন বা খাবার কোনো ভাবেই রাসায়নিক কেমিক্যাল এর সংস্পর্ষে আসতইন্টারন্যাশনাল ফেডারেশন অব অর্গানিক এগ্রিকালচার মুভমেন্টের অনুসৃত ১৭টি মৌলিক নীতি অন্যতম হলো পোল্ট্রির স্বাধীনতা ও কল্যাণ নিশ্চিত করা। তাই অর্গানিক পদ্ধতিতে মুরগির ঘনত্ব কম রাখা, খোলামেলা চলাফেরার সুযোগ দেয়া, প্রাকৃতিক খাদ্য খাওয়ানো ও মানবিক আচরণের দিকে লক্ষ্য রাখা এই বিষয়গুলো মাথায় রাখতে হবে। অসুস্থ হলে রোগ প্রতিকারও অর্গানিক পদ্ধতিতে করা হয়। (অনেকে আবার শুধুমাত্র ট্যাব্লেটের বদলে ভেষজ উদ্ভিদ খাওয়ানোকেই অর্গানিক বলে মনে কতাহলে স্বাস্থ্য সচেতন গ্রাহক, আমরা যারা নিজেকে বোঝাচ্ছি যে, বিক্রেতার নিজের ফার্মে উৎপাদিত ডিম বা মুরগির মাংসই অর্গানিক তাদের আগে নিজেকে ‘অর্গানিক কি বা কিভাবে হয়’ তা বুঝতে হবে। শুধু মার্কেটিং এর জোরে প্রোডাক্ট এর গায়ে অর্গানিক লেবেল লাগিয়ে অর্গানিক বানানো আসলে কতটুকু অর্গানিক সেটাও প্রমাণ করতে হবে। অনলাইনে অনেক আর্টিক্যাল আছে অর্গানিক ফার্মিং নিয়ে। সেখানে অর্গানিক ফার্মিং করার প্রতিটা ধাপকে সুন্দরভাবে বুঝিয়ে দেয়া আছে। চাইলে সেগুলো পড়তে</span></p><p><span> পারেন।</span></p><p><br></p>",
    authorName: "Zikrul Hakim",
    blogCategoryId: "35e2c3aa-6c4b-4805-be84-3ae5d32fbdb3",
    mediaId: "49891985-8074-45b8-8c3c-b87ea7a1ea81",
  },
  {
    id: "c2e99b97-7138-4c8c-9403-b11bc33c6e76",
    title: "মধু খাওয়ার উত্তম সময় কখন",
    slug: "when-take-honey",
    content:
      "<p><span>প্রাচীনকাল থেকেই মহৌষধ হিসাবে মধু ব্যবহৃত হয়ে আসছে, এছাড়াও এর নানাবিধ উপকারী দিক মধুকে করেছে অনন্য! কারণ মধুতে আছে প্রচুর পরিমাণে মিনারেল, ভিটামিন ও এনজাইম যা শরীরকে বিভিন্ন অসুখ বিসুখ থেকে রক্ষা করে। কিন্তু আমরা প্রায় সময়ই বুঝি না আসলে দিনের কোন সময়টায় মধু খাওয়া উচিত? যেমন প্রতিদিন সকালে এক চামচ মধু খেলে একদিকে যেমন ঠাণ্ডা, কফ, কাশি সহ ইত্যাদি সমস্যা কমে যায়, অন্যদিকে শরীরের নানা বিধ ইতিবাচক পরিবর্তনওপ্রতিদিন সকালে মধু খাওয়ার এই অভ্যাস শরীরের রোগ প্রতিরোধ করার ক্ষমতাকে বাড়িয়ে তুলতে পারে। এর সাথে, বিশেষ করে সকালে খালি পেটে হালকা গরম পানিতে লেবুর রস ও মধু মিশিয়ে খেলে তা ওজন কমাতে সাহায্য করে কিছুদিনের মধ্যেই। এছাড়াও এতে লিভারও পরিস্কার থাকে।আপনি কি জানেন, শরীরের দুর্বলতা ও চা-কফির নেশাও কমায় মধু। তাই চা-কফির অভ্যাসের পরিবর্তে প্রতিদিন সকালে যদি মধুর সঙ্গে দারুচিনির গুঁড়ো মিশিয়ে খাওয়া যায় তা রক্তনালীর সমস্যা দূর করে এবং সাথে সাথে রক্তের খারাপ কোলেস্টেরলের পরিমাণও ১০ ভাগ পর্যন্ত কমিয়ে দেয়। আবার মধু ও দারুচিনির এই মিশ্রণ নিয়মিত সকালবেলা খেলে হার্ট অ্যাটাকের ঝুঁকিও কমএছাড়াও, হজমের সমস্যা দূর করতে প্রতিদিন সকালে মধু খাওয়ার অভ্যাস করতে পারেন। কারন মধু পেটের অম্লভাব কমিয়ে হজম প্রক্রিয়ায় সহায়তা করে। এরফলে হজমের সমস্যা দূর করার জন্য মধু খেতে চাইলে প্রতিবার ভারি খাবার খাওয়ার আগে এক চামচ মধু খেয়ে নিন। বিশেষ করে সকালবেলা খালি পেটে এক চামচ মধু কিন্তু খুবই উপকারী।মধুতে আছে প্রাকৃতিক চিনি, যা শরীরে শক্তি যোগায় এবং শরীরকে কর্মক্ষম রাখে। বিশেষ করে যারা মিষ্টি জাতীয় কিছু খেতে পছন্দ করেন, তারা অন্য মিষ্টি খাবারের বদলে মধু খেতে পারেন।</span></p><p><span>রেফারেন্স-</span></p>",
    authorName: "Zikrul Hakim",
    blogCategoryId: "7c0f3350-1974-41c2-a0d5-62a1a0648d43",
    mediaId: "6abc17cf-2e2a-40c3-bdaf-3cef44fafe4d",
  },
];
