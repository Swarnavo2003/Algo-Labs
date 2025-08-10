import {z} from "zod";

export const userRegistrationSchema = z.object({
  email: z.string().email("Email is invalid").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  name: z.string().min(1, "Name is required").optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email("Email is invalid").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});
