"use server";
import { z } from "zod";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_ERROR_MESSAGE,
  USERNAME_ERROR_MESSAGE
} from "@/lib/constants";

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
      .min(USERNAME_MIN_LENGTH, "Username must be at least 5 characters")
      .max(USERNAME_MAX_LENGTH, "Username must be less than 10 characters")
      .trim()
      .regex(USERNAME_REGEX, USERNAME_ERROR_MESSAGE)
      .transform((username) => `${username}`)
      .refine(checkUsername, "that word not allowed"),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters")
      .max(PASSWORD_MAX_LENGTH, "Password must be less than 16 characters")
      .trim()
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
    confirmPassword: z.string().trim(),
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
    } else {
      console.log(result.data)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, fieldErrors: error.flatten().fieldErrors };
    }
    return { success: false, message: "Failed to create account" };
  }
};
