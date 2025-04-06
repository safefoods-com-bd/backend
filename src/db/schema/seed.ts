import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";

const connectionString = process.env.DATABASE_URL!;
export const db = drizzle(connectionString, { schema, logger: true });

import { permissionData, roleData, userData } from "./seeders/seedData";
import { hash } from "bcryptjs";
import { eq, inArray, sql } from "drizzle-orm";

async function seedPermissions() {
  for (const permission of permissionData) {
    await db
      .insert(schema.permissionsTable)
      .values(permission)
      .onConflictDoNothing();
  }
}

async function seedRoles() {
  for (const role of roleData) {
    await db.insert(schema.rolesTable).values(role).onConflictDoNothing();
  }
}

// Assign permissions to 'Admin' role
async function seedPermissionToRoles() {
  const permissions = await db.select().from(schema.permissionsTable);
  const roleId = await db
    .select({ id: schema.rolesTable.id })
    .from(schema.rolesTable)
    .where(eq(schema.rolesTable.name, "admin"));

  const permissionToRolesData = permissions.map((permission) => ({
    permissionId: permission.id,
    roleId: roleId[0].id,
  }));

  // Insert all permission assignments for admin
  for (const assignment of permissionToRolesData) {
    await db
      .insert(schema.permissionToRolesTable)
      .values(assignment)
      .onConflictDoNothing();
  }
}
// Assign specific permissions to 'user' role
async function seedUserRolePermissions() {
  try {
    const userRole = await db
      .select({ id: schema.rolesTable.id })
      .from(schema.rolesTable)
      .where(eq(schema.rolesTable.name, "user"))
      .limit(1);

    if (!userRole[0]) {
      throw new Error("User role not found - make sure to seed roles first");
    }

    const userPermissions = await db
      .select()
      .from(schema.permissionsTable)
      .where(
        inArray(schema.permissionsTable.name, [
          "read_profile",
          "update_profile",
        ]),
      );

    const userPermissionAssignments = userPermissions.map((permission) => ({
      roleId: userRole[0].id,
      permissionId: permission.id,
    }));

    for (const assignment of userPermissionAssignments) {
      await db
        .insert(schema.permissionToRolesTable)
        .values(assignment)
        .onConflictDoNothing();
    }
  } catch {
    process.exit(1);
  }
}

async function seedUsers() {
  const roleId = await db
    .select({ id: schema.rolesTable.id })
    .from(schema.rolesTable)
    .where(eq(schema.rolesTable.name, "admin"));
  for (const user of userData) {
    const hashedPassword = await hash(user.password, 10);
    await db
      .insert(schema.usersTable)
      .values({ ...user, roleId: roleId[0].id, password: hashedPassword })
      .onConflictDoNothing();
  }
}

async function seedAll() {
  await seedPermissions();
  await seedRoles();
  await seedPermissionToRoles();
  await seedUserRolePermissions();
  await seedUsers();
}

const handleError = (error: Error) => {
  process.stderr.write(`Error: ${error.message}\n`);
};

seedAll()
  .catch(handleError)
  .finally(() => process.exit());
