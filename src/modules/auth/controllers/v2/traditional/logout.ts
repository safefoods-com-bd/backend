import {
  ACCESS_TOKEN_NAME,
  isProduction,
  REFRESH_TOKEN_NAME,
} from "@/constants/variables";
import { handleError } from "@/utils/errorHandler";
import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
  try {
    // const userEmail = req.body.email;
    // to do : remove the refresh token from the database

    // console.log(`User ${userEmail} is logging out`);
    res.cookie(ACCESS_TOKEN_NAME, "", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: 0,
    });

    // Set the refresh token in the cookie
    res.cookie(REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // "none" for production, "lax" for development
      secure: isProduction, // true for production, false for development
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

    //todo : HEATOS links
  } catch (error) {
    handleError(error, res);
  }
};
