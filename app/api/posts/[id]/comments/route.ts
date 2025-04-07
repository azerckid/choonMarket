import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const postId = Number(params.id);
    if (isNaN(postId)) {
        return NextResponse.json(
            { error: "Invalid post ID" },
            { status: 400 }
        );
    }

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

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session.user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const postId = Number(params.id);
    if (isNaN(postId)) {
        return NextResponse.json(
            { error: "Invalid post ID" },
            { status: 400 }
        );
    }

    try {
        const { content } = await request.json();
        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const comment = await db.comment.create({
            data: {
                content,
                postId,
                userId: session.user.id,
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
        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
} 