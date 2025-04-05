"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function likePost(postId: number) {
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

export async function dislikePost(postId: number) {
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