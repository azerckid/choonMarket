import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { likePost, dislikePost } from "./actions";
import ViewCounter from "./view-counter";

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
    const idParam = await params.id;
    const id = Number(idParam);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }
    const session = await getSession();
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
                    <span className="text-sm font-semibold">{post.user.username}</span>
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
                    <button
                        className={
                            `flex items-center gap-2 text-neutral-400 text-sm
                            border-none rounded-full p-2
                             ${isLiked ? "bg-blue-500 text-white" : ""}`}
                    >
                        {isLiked ? (
                            <HandThumbUpIcon className="size-5" />
                        ) : (
                            <HandThumbUpIconOutline className="size-5" />
                        )}
                        <span>공감하기 ({post._count.likes})</span>
                    </button>
                </form>
            </div>
        </div>
    );
}