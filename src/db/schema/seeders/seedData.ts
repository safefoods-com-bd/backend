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
