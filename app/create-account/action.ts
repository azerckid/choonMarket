"use server"
import { z } from "zod"

const usernameSchema = z.string().min(5).max(10);

export const createAccount = async (prevState: any, formData: FormData) => {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        }
        console.log("data", data);

        // Here you would typically:
        // 1. Validate the input
        usernameSchema.parse(data.username);
        // 2. Check if user already exists
        // 3. Hash the password
        // 4. Store in database
        // 5. Create session/token

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create account"
        };
    }
}