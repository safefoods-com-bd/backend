import { listAllUsers, getSingleUser, createUser } from "./usersController";
import userRoutes from "./usersRoute";
import { createUserSchema } from "./usersValidation";

export {
  listAllUsers,
  getSingleUser,
  createUser,
  userRoutes,
  createUserSchema,
};
