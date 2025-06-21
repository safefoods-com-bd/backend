/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db/db";
import {
  permissionsTable,
  permissionToRolesTable,
  rolesTable,
  usersTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import RedisService from "@/services/redisClient";
export function generateRandomCode(): number {
  const length = 6;
  const characters = "0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return parseInt(code);
}

const key = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function encrypt(payload: any, expiresTime: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresTime)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error: any) {
    return error;
  }
}

export async function verifySession(token: string): Promise<any> {
  const tokenData = await decrypt(token);
  if (tokenData.code === "ERR_JWT_EXPIRED") {
    return {
      message: "Token Expired",
      success: false,
    };
  }
  if (tokenData.code === "JWSSignatureVerificationFailed") {
    return {
      message: "Invalid Token Submitted",
      success: false,
    };
  }
  if (tokenData.userData) {
    return {
      data: tokenData.userData,
      success: true,
    };
  }
  return {
    message: "Invalid Token",
    success: false,
  };
}

// export const withPermission = (permission: string) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const cookies = req.cookies;
//     console.log("cookies", cookies.accessToken);
//     if (!cookies.accessToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const tokenData = await verifySession(cookies.accessToken);
//     // console.log("tokenData", tokenData);
//     if (tokenData.success === false) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const permissions = await getPermissions(tokenData.data.id);
//     // console.log("permissions", permissions);
//     if (permissions.includes(permission)) {
//       console.log("permission granted");
//       return next();
//     }

//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   };
// };

export const getPermissions = async (userId: string) => {
  // Check Redis cache first
  const cachedPermissions = await RedisService.get(
    `user:permissions:${userId}`,
  );
  if (cachedPermissions) {
    // console.log("cachedPermissions", cachedPermissions);
    return cachedPermissions;
  }
  const response = await db
    .select({
      id: usersTable.id,
      permissions: sql<string>`STRING_AGG(${permissionsTable.name}, ',')`,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .leftJoin(rolesTable, sql`${usersTable.roleId} = ${rolesTable.id}`)
    .leftJoin(
      permissionToRolesTable,
      sql`${rolesTable.id} = ${permissionToRolesTable.roleId}`,
    )
    .leftJoin(
      permissionsTable,
      sql`${permissionToRolesTable.permissionId} = ${permissionsTable.id}`,
    )
    .groupBy(usersTable.id, rolesTable.id);

  const permissionsArray = response[0].permissions.split(",");
  if (permissionsArray) {
    // console.log("storing in redis");
    await RedisService.set(`user:permissions:${userId}`, permissionsArray, 10);
  }
  return permissionsArray;
};

export async function decryptTokenData(token: string): Promise<any> {
  const tokenData = await decrypt(token);
  if (tokenData.code === "ERR_JWT_EXPIRED") {
    return {
      message: "Token Expired",
      success: false,
    };
  }
  if (tokenData.code === "JWSSignatureVerificationFailed") {
    return {
      message: "Invalid Token Submitted",
      success: false,
    };
  }
  if (tokenData.email) {
    return {
      data: tokenData,
      success: true,
    };
  }
  return {
    message: "Invalid Token",
    success: false,
  };
}
