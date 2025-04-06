"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function incrementViews(id: number) {
    await db.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
    revalidatePath(`/posts/${id}`);
}

export async function likePost(formData: FormData) {
    const postId = Number(formData.get("postId"));
    const session = await getSession();
    try {
        await db.like.create({
            data: {
                postId,
                userId: session.user?.id!,
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch (e) { }
}

export async function dislikePost(formData: FormData) {
    const postId = Number(formData.get("postId"));
    try {
        const session = await getSession();
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId: session.user?.id!,
                },
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch (e) { }
} 