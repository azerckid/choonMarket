"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { Comment } from "./types";

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
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }
    const userId = session.user.id;
    try {
        await db.like.create({
            data: {
                postId,
                userId,
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch {
        // Error handling if needed
    }
}

export async function dislikePost(formData: FormData) {
    const postId = Number(formData.get("postId"));
    const session = await getSession();
    if (!session?.user?.id) {
        return { error: "로그인이 필요합니다." };
    }
    const userId = session.user.id;
    try {
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId,
                },
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch {
        // Error handling if needed
    }
}

// Get comments for a post
export async function getComments(postId: number): Promise<Comment[]> {
    noStore();

    try {
        const comments = await db.comment.findMany({
            where: {
                postId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return comments;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw new Error("Failed to fetch comments");
    }
}

// Create a new comment
export async function createComment(postId: number, content: string): Promise<Comment> {
    try {
        const session = await getSession();
        if (!session?.user) {
            throw new Error("Authentication required");
        }

        if (!content || typeof content !== "string" || content.trim().length === 0) {
            throw new Error("Comment content is required");
        }

        // Check if post exists
        const post = await db.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const comment = await db.comment.create({
            data: {
                content: content.trim(),
                userId: session.user.id,
                postId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        revalidatePath(`/posts/${postId}`);
        return comment;
    } catch (error) {
        console.error("Failed to create comment:", error);
        throw error;
    }
} 