import { integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import rolesTable from "./roles";
import permissionsTable from "./permissions";

const permissionToRolesTable = pgTable(
  "permission_to_roles",
  {
    permissionId: integer("permission_id").references(
      () => permissionsTable.id,
    ),
    roleId: uuid("role_id").references(() => rolesTable.id),
  },
  (t) => ({
    unq: unique().on(t.permissionId, t.roleId),
  }),
);
export default permissionToRolesTable;
