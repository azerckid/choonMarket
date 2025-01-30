"use server"
import { z } from "zod";
import { EMAIL_ERROR_MESSAGE, EMAIL_REGEX, PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "@/lib/constants";

const loginSchema = z.object({
    email: z.string().email(EMAIL_ERROR_MESSAGE).regex(EMAIL_REGEX),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});

export async function login(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            return result.error.flatten();
        } else {
            console.log(result.data)
        }
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, fieldErrors: error.flatten().fieldErrors };
        }
        return { success: false, message: "Login failed" };
    }
}