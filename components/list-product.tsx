import Image from "next/image";
import Link from "next/link";
import { Category } from "@prisma/client";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";

interface Product {
    id: number;
    title: string;
    price: number;
    photo: string;
    createdAt: Date;
    category: Category;
}

export default function ListProduct({
    id,
    title,
    price,
    photo,
    createdAt,
    category,
}: Product) {
    return (
        <Link href={`/products/${id}`} className="flex gap-5 relative">
            <Image
                className="size-28 rounded-md"
                src={`${photo}/public`}
                alt={title}
                width={500}
                height={500}
                placeholder="blur"
                blurDataURL={photo}
            />
            <div className="flex flex-col flex-1 justify-between py-1.5">
                <div className="flex items-center">
                    <span className="text-lg">{title}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-white">{formatToWon(price)}원</span>
                    <span className="text-sm text-neutral-400">{formatToTimeAgo(createdAt.toString())}</span>
                </div>
            </div>
            <div className="absolute top-0 right-0 text-center text-sm text-neutral-400 py-2 rounded-md">{category}</div>
        </Link>
    );
}