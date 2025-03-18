import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatToWon, formatUsername } from "@/lib/utils";
import { UserIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session?.user?.id) {
        return session.user.id === userId;
    }
    return false;
}

async function getProduct(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = await db.product.findUnique({
        where: {
            id,
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
    return product;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    console.log(product);
    const isOwner = await getIsOwner(product.userId);

    return (
        <div>
            <div className="p-3 text-lg text-neutral-400 z-10 flex items-center gap-2">
                <Link href="/products" className="hover:text-white">
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <span>Product #{id}</span>
            </div>
            <div className="relative w-full aspect-square">
                <Image
                    className="object-cover"
                    fill
                    src={product.photo}
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
            <div className="p-5 pb-32">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
                <p className="mt-4 text-neutral-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            <div className="fixed w-full bottom-0 left-0 p-5 pb-5 bg-neutral-800 flex justify-between items-center">
                <span className="font-semibold text-xl">
                    {formatToWon(product.price)}원
                </span>
                {isOwner ? (
                    <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                        Delete product
                    </button>
                ) : null}
                <Link
                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    href={``}
                >
                    채팅하기
                </Link>
            </div>
        </div>
    );
}