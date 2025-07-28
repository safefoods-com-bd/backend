import "dotenv/config";
import "module-alias/register";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";

const connectionString = process.env.DATABASE_URL!;
export const db = drizzle(connectionString, { schema, logger: true });

import {
  accountData,
  categoryData,
  categoryLevelsData,
  couponsData,
  deliveryZoneData,
  mediaData,
  orderData,
  permissionData,
  productData,
  productOrderData,
  roleData,
  stockData,
  unitData,
  userData,
  variantProductData,
  variantProductMediaData,
  warehouseData,
} from "./seeders/seedData";
import { hash } from "bcryptjs";
import { eq, inArray } from "drizzle-orm";
import { USER_ACCOUNT_TYPE } from "@/data/constants";

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
//Insert Different Types of Accounts
async function seedAccounts() {
  for (const account of accountData) {
    await db.insert(schema.accountsTable).values(account).onConflictDoNothing();
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
    const newUser = await db
      .insert(schema.usersTable)
      .values({ ...user, roleId: roleId[0].id, password: hashedPassword })
      .returning()
      .onConflictDoNothing();

    await db
      .insert(schema.usersToAccountsTable)
      .values({
        userId: newUser[0].id,
        providerName: USER_ACCOUNT_TYPE.TRADITIONAL,
      })
      .onConflictDoNothing();
  }
}

async function seedCategoryLevels() {
  for (const categoryLevel of categoryLevelsData) {
    await db
      .insert(schema.categoryLevelsTable)
      .values(categoryLevel)
      .onConflictDoNothing();
  }
}

async function seedCategories() {
  for (const category of categoryData) {
    await db
      .insert(schema.categoriesTable)
      .values(category)
      .onConflictDoNothing();
  }
}

async function seedMedia() {
  for (const media of mediaData) {
    await db.insert(schema.mediaTable).values(media).onConflictDoNothing();
  }
}

async function seedWarehouses() {
  for (const warehouse of warehouseData) {
    await db
      .insert(schema.warehouseTable)
      .values(warehouse)
      .onConflictDoNothing();
  }
}

async function seedProducts() {
  for (const product of productData) {
    await db.insert(schema.productsTable).values(product).onConflictDoNothing();
  }
}

//unitData
async function seedUnits() {
  for (const unit of unitData) {
    await db.insert(schema.unitsTable).values(unit).onConflictDoNothing();
  }
}

async function seedVariantProducts() {
  for (const variant of variantProductData) {
    const result = await db
      .insert(schema.variantProductsTable)
      .values(variant)
      .returning()
      .onConflictDoNothing();
    console.log("Variant Product Result:", result);
    await db
      .insert(schema.stockTable)
      .values({
        variantProductId: result[0].id,
        quantity: variant.initialStock,
        warehouseId: "257b861a-50e6-4b79-a5fd-ae87ddefc88b",
      })
      .onConflictDoNothing();
  }
}

async function seedStocks() {
  for (const stock of stockData) {
    await db.insert(schema.stockTable).values(stock).onConflictDoNothing();
  }
}

// async function seedOrders() {
//   for (const order of orderData) {
//     await db.insert(schema.ordersTable).values(order).onConflictDoNothing();
//   }
// }

async function seedOrderProducts() {
  for (const order of productOrderData) {
    await db
      .insert(schema.productsOrdersTable)
      .values(order)
      .onConflictDoNothing();
  }
}

async function seedCoupons() {
  for (const coupon of couponsData) {
    await db.insert(schema.couponsTable).values(coupon).onConflictDoNothing();
  }
}

async function seedDeliveryZones() {
  for (const zone of deliveryZoneData) {
    await db
      .insert(schema.deliveryZoneTable)
      .values(zone)
      .onConflictDoNothing();
  }
}

async function seedVariantProductsMedia() {
  for (const variantMedia of variantProductMediaData) {
    await db
      .insert(schema.variantProductsMediaTables)
      .values(variantMedia)
      .onConflictDoNothing();
  }
}

async function seedAll() {
  await seedPermissions();
  await seedRoles();
  await seedPermissionToRoles();
  await seedUserRolePermissions();
  await seedAccounts();
  await seedUsers();
  await seedCategoryLevels();
  await seedCategories();
  await seedWarehouses();
  await seedProducts();
  await seedUnits();
  await seedVariantProducts();
  await seedMedia();
  // await seedStocks();
  // await seedOrders();
  // await seedOrderProducts();
  await seedCoupons();
  await seedDeliveryZones();
  await seedVariantProductsMedia();
}

const handleError = (error: Error) => {
  process.stderr.write(`Error: ${error.message}\n`);
};

seedAll()
  .catch(handleError)
  .finally(() => process.exit());
