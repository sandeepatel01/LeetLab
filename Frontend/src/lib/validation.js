import { z } from "zod";

export const signupSchema = z.object({
      name: z.string(3, "Name must be at least 3 characters long"),
      username: z.string(2, "Username must be at least 2 characters long"),
      email: z.string().email("Enter a valid email"),
      password: z.string().min(6, "Password must be at least 6 characters long"),
      avatar: z.string().url("Enter a valid url"),
})