import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@prisma/client";

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
    console.log(photo);
    console.log(category);
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
            <div className="flex flex-col flex-1">
                <span className="text-lg">{title}</span>
                <span className="text-lg font-semibold">{formatToWon(price)}원</span>
                <span className="text-sm text-neutral-400">{formatToTimeAgo(createdAt.toString())}</span>
            </div>
            <div className="absolute top-0 right-20 text-center text-base text-white bg-neutral-700 px-2 py-1 rounded-md">{category}</div>
        </Link>
    );
}