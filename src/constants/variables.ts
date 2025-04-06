import { Google } from "arctic";

export const isProduction = process.env.NODE_ENV === "production";

export const ACCESS_TOKEN_NAME =
  process.env.ACCESS_TOKEN_NAME || "access_token";
export const REFRESH_TOKEN_NAME =
  process.env.REFRESH_TOKEN_NAME || "refresh_token";
export const COMMON_BASE = process.env.COMMON_BASE || "localhost";
export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.DOMAIN
    : "http://localhost:3000";
//token ages
export const ACCESS_TOKEN_AGE =
  process.env.ACCESS_TOKEN_AGE || "15 mins from now";
export const ACCESS_TOKEN_COOKIE_MAX_AGE =
  Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE) || 1000 * 60 * 15;

export const REFRESH_TOKEN_AGE =
  process.env.REFRESH_TOKEN_AGE || "30 days from now";
export const REFRESH_TOKEN_COOKIE_MAX_AGE =
  Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 30;

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  (process.env.NODE_ENV === "production"
    ? process.env.DOMAIN
    : "http://localhost:8000") + "/api/auth/google",
);
