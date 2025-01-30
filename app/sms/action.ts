"use server"

import { z } from "zod";
import { PHONE_ERROR_MESSAGE } from "@/lib/constants";

const smsSchema = z.object({
    phone: z.string().min(10).max(11).regex(/^[0-9]+$/, PHONE_ERROR_MESSAGE),
    code: z.string().length(6).regex(/^[0-9]+$/, "Invalid verification code"),
});

export async function smsVerification(prevState: any, formData: FormData) {
    const data = {
        phone: formData.get("phone"),
        code: formData.get("code"),
    };
    try {
        const result = smsSchema.safeParse(data);
        if (!result.success) {
            return result.error.flatten();
        }
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, fieldErrors: error.flatten().fieldErrors };
        }
        return { success: false, message: "Verification failed" };
    }
}