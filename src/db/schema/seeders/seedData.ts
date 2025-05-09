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

// export const categoryData = [
//   {
//     id: "ff544434-5843-4609-8475-3fe7737dfca9",
//     title: "Seasonal Food",
//     slug: "seasonal-food",
//     parentId: null,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];
