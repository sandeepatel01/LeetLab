import { z } from "zod";

export const signupSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      username: z.string().min(2, "Username must be at least 2 characters long"),
      email: z.string().email("Enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
      avatar: z.string().url("Enter a valid url").optional(),
});

export const LoginSchema = z.object({
      email: z.string().email("Enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
});