import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

export const metadata = {
    title: "Home",
};

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
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

export default async function Products() {
    const initialProducts = await getCachedProducts();
    const revalidate = async () => {
        "use server";
        revalidatePath("/home");
    };
    return (
        <div>
            {/* <Link href="/home/recent" className="text-blue-500 text-lg font-semibold">RECENT</Link> */}
            <ProductList initialProducts={initialProducts} />
            <form action={revalidate}>
                <button>Revalidate</button>
            </form>
            <Link
                href="/home/add"
                className="bg-blue-500 text-white flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 transition-colors hover:bg-pink-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
