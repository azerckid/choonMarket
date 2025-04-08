import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { likePost, dislikePost } from "./actions";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo, formatUsername } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import ViewCounter from "./view-counter";
import LikeButton from "@/components/like-button";
import CommentSection from "@/components/comment-section";

async function getPost(id: number) {
    try {
        const post = await db.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
        return post;
    } catch (e) {
        return null;
    }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
    tags: ["post-detail"],
});

async function getLikeStatus(postId: number, userId: number | undefined) {
    if (!userId) return { likeCount: 0, isLiked: false };

    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

function getCachedLikeStatus(postId: number, userId: number | undefined) {
    const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId, userId);
}

export default async function PostDetail({
    params,
}: {
    params: { id: string };
}) {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }
    const session = await getSession();
    console.log("Session in post page:", {
        exists: !!session,
        hasUser: !!session.user,
        userId: session.user?.id,
        username: session.user?.username,
        email: session.user?.email
    });
    console.log("isLoggedIn value:", !!session.user);
    const { isLiked, likeCount } = await getCachedLikeStatus(id, session.user?.id);

    return (
        <div className="p-5 text-white">
            <ViewCounter postId={id} />
            <div className="flex items-center gap-2 mb-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div>
                    <span className="text-sm font-semibold">{formatUsername(post.user.username)}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.createdAt.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>
                <form action={isLiked ? dislikePost : likePost}>
                    <input type="hidden" name="postId" value={id} />
                    <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
                </form>
            </div>
            <CommentSection postId={id} isLoggedIn={!!session.user} />
        </div>
    );
}