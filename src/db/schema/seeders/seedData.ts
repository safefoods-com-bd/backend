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

// ...existing code...

export const categoryLevelsData = [
  // Main categories (Level 1)
  {
    title: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Meat & Seafood",
    slug: "meat-seafood",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dairy & Eggs",
    slug: "dairy-eggs",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Bakery",
    slug: "bakery",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Grains & Pasta",
    slug: "grains-pasta",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Sub-categories (Level 2)
  {
    title: "Fresh Fruits",
    slug: "fresh-fruits",
    parentId: 1, // Child of Fruits & Vegetables
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Fresh Vegetables",
    slug: "fresh-vegetables",
    parentId: 1, // Child of Fruits & Vegetables
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Frozen Fruits",
    slug: "frozen-fruits",
    parentId: 1, // Child of Fruits & Vegetables
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Beef",
    slug: "beef",
    parentId: 2, // Child of Meat & Seafood
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Poultry",
    slug: "poultry",
    parentId: 2, // Child of Meat & Seafood
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Fish",
    slug: "fish",
    parentId: 2, // Child of Meat & Seafood
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Milk",
    slug: "milk",
    parentId: 3, // Child of Dairy & Eggs
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Cheese",
    slug: "cheese",
    parentId: 3, // Child of Dairy & Eggs
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Bread",
    slug: "bread",
    parentId: 4, // Child of Bakery
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Rice",
    slug: "rice",
    parentId: 5, // Child of Grains & Pasta
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Sub-sub-categories (Level 3)
  {
    title: "Apples",
    slug: "apples",
    parentId: 6, // Child of Fresh Fruits
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Bananas",
    slug: "bananas",
    parentId: 6, // Child of Fresh Fruits
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Leafy Greens",
    slug: "leafy-greens",
    parentId: 7, // Child of Fresh Vegetables
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Chicken",
    slug: "chicken",
    parentId: 10, // Child of Poultry
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Turkey",
    slug: "turkey",
    parentId: 10, // Child of Poultry
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ...existing code...
