import db from "@/lib/db";

export async function getPosts() {
    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            createdAt: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });
    return posts;
}