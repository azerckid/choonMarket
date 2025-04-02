import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

export const metadata = {
    title: "Home",
};


async function getInitialProducts() {
    console.log("hit!!!!!");
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 5,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;

export const dynamic = "auto";
// export const revalidate = 60;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            {/* <Link href="/home/recent" className="text-blue-500 text-lg font-semibold">RECENT</Link> */}
            <ProductList initialProducts={initialProducts} />
            <Link
                href="/home/add"
                className="bg-blue-500 text-white flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 transition-colors hover:bg-pink-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
