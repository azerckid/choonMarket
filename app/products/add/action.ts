"use server";

type FormState = {
    fieldErrors?: {
        title?: string[];
        price?: string[];
        description?: string[];
    };
} | null;

import { productSchema } from "./zodSchema";
import fs from "fs/promises";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function uploadProduct(state: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            fieldErrors: {
                title: ["로그인이 필요합니다."]
            }
        };
    }

    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };

    if (data.photo instanceof File) {
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
        data.photo = `/${data.photo.name}`;
    }

    const result = await productSchema.safeParse(data);
    if (!result.success) {
        return {
            fieldErrors: result.error.flatten().fieldErrors
        };
    }

    await db.product.create({
        data: {
            title: result.data.title,
            price: result.data.price,
            description: result.data.description,
            photo: typeof result.data.photo === 'string' ? result.data.photo : `/${result.data.photo.name}`,
            user: {
                connect: {
                    id: session.user.id
                }
            }
        },
    });

    redirect("/products");
}