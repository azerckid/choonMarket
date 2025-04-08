import db from "@/lib/db";
import { formatToWon, formatUsername } from "@/lib/utils";
import { UserIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { Suspense } from "react";
import Loading from "./loading";
import { deleteProduct, createChatRoom } from "./action";
import { getIsOwner, getProduct } from "./action";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "xxxx"],
});

async function getProductTitle(id: number) {
    console.log("title");
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            title: true,
            description: true,
            photo: true,
        },
    });
    return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title", "xxxx"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await getCachedProductTitle(Number(id));
    return {
        title: product?.title,
        description: product?.description,
        openGraph: {
            images: [
                { url: product?.photo },
            ],
        },
    }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getCachedProduct(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);

    return (
        <Suspense fallback={<Loading />}>
            <div className="mx-auto max-w-screen-md flex flex-col gap-5 justify-center">
                <div className="p-3 text-lg text-neutral-400 z-10 flex items-center gap-2">
                    <Link href="/home" className="hover:text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <span>Product #{id}</span>
                </div>
                <div className="relative w-full aspect-square">
                    <Image
                        className="object-cover"
                        fill
                        src={`${product.photo}/public`}
                        alt={product.title}
                    />
                </div>
                <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                    <div className="relative size-10 overflow-hidden rounded-full">
                        {product.user.avatar !== null ? (
                            <Image
                                className="object-cover"
                                fill
                                src={product.user.avatar}
                                alt={product.user.username}
                            />
                        ) : (
                            <UserIcon />
                        )}
                    </div>
                    <div>
                        <h3>{formatUsername(product.user.username)}</h3>
                    </div>
                </div>
                <div className="p-5 pb-10">
                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                    <p>{product.description}</p>
                </div>
                <div className="flex justify-between items-center p-5">
                    <span className="font-semibold text-xl">
                        price : {formatToWon(product.price)}원
                    </span>
                    <form action={async () => {
                        "use server";
                        const result = await createChatRoom(id.toString());
                        if ("error" in result) {
                            return;
                        }
                        redirect(`/chat/${result.roomId}`);
                    }}>
                        <button type="submit" className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                            채팅하기
                        </button>
                    </form>
                </div>
                {isOwner ? (
                    <form action={async () => {
                        "use server";
                        await deleteProduct(id);
                    }}>
                        <div className="flex flex-col gap-2 justify-center items-center p-5">
                            <p className="text-neutral-400">* if you are the owner, you can delete the product.</p>
                            <div className="flex gap-2">
                                <Link href={`/products/${id}/edit`} className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold">
                                    Edit product
                                </Link>
                                <button type="submit" className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                                    Delete product
                                </button>
                            </div>
                        </div>
                    </form>
                ) : null}
            </div>
        </Suspense>
    );
}
