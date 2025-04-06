import * as z from "zod";

export const validateZodSchema = (schema: z.ZodSchema) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data: any) => {
    const validation = schema.safeParse(data);
    // console.log("from middleware", validation);
    if (!validation.success) {
      const formattedErrors = validation.error.errors.reduce(
        (acc, err) => {
          const field = err.path.join(".");
          acc[field] = err.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      throw {
        status: 400,
        type: "validation",
        error: "Validation failed",
        details: formattedErrors,
      };
    }
    // console.log("here", validation.data);
    return validation.data;
  };
};
