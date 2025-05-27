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

export const problemSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
      tags: z.array(z.string()).min(1, "At least one tag is required"),
      constraints: z.string().min(1, "Constraints are required"),
      hints: z.string().optional(),
      editorial: z.string().optional(),
      testcases: z
            .array(
                  z.object({
                        input: z.string().min(1, "Input is required"),
                        output: z.string().min(1, "Output is required"),
                  })
            )
            .min(1, "At least one test case is required"),
      examples: z.object({
            JAVASCRIPT: z.object({
                  input: z.string().min(1, "Input is required"),
                  output: z.string().min(1, "Output is required"),
                  explanation: z.string().optional(),
            }),
            PYTHON: z.object({
                  input: z.string().min(1, "Input is required"),
                  output: z.string().min(1, "Output is required"),
                  explanation: z.string().optional(),
            }),
            JAVA: z.object({
                  input: z.string().min(1, "Input is required"),
                  output: z.string().min(1, "Output is required"),
                  explanation: z.string().optional(),
            }),
      }),
      codeSnippets: z.object({
            JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
            PYTHON: z.string().min(1, "Python code snippet is required"),
            JAVA: z.string().min(1, "Java solution is required"),
      }),
      referenceSolutions: z.object({
            JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
            PYTHON: z.string().min(1, "Python solution is required"),
            JAVA: z.string().min(1, "Java solution is required"),
      })
});