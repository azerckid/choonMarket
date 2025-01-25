"use server";
import { z } from "zod";

const checkUsername = (username: string) => {
  const forbiddenWords = ["sex", "fuck", "porn", "nsfw", "xxx"];
  return !forbiddenWords.some(word => username.toLowerCase().includes(word));
}
const checkPassword = ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
  return password === confirmPassword;
}

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "username must be a string",
        required_error: "where is my username?"
      })
      .min(5, "Username must be at least 5 characters")
      .max(10, "Username must be less than 10 characters")
      .refine(checkUsername, "that word not allowed"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(checkPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  try {
    const result = formSchema.safeParse(data);
    if (!result.success) {
      return result.error.flatten();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, fieldErrors: error.flatten().fieldErrors };
    }
    return { success: false, message: "Failed to create account" };
  }
};
