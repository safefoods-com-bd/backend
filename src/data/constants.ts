//statuses

export const STATUS = {
  ASSIGNED: "assigned",
  INPROGRESS: "in-progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const USER_ACCOUNT_TYPE = {
  TRADITIONAL: "traditional",
  MOBILE_OTP: "mobile_otp",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  APPLE: "apple",
  GITHUB: "github",
} as const;
