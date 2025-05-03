"use client";

import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";
import { Category } from "@prisma/client";

interface Product {
    id: number;
    title: string;
    price: number;
    photo: string;
    createdAt: Date;
    category: Category;
}

interface ProductListProps {
    initialProducts: Product[];
    disableInfiniteScroll?: boolean;
}

export default function ProductList({ initialProducts, disableInfiniteScroll = false }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(disableInfiniteScroll);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (disableInfiniteScroll) return;

        const observer = new IntersectionObserver(
            async (
                entries: IntersectionObserverEntry[],
                observer: IntersectionObserver
            ) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current);
                    setIsLoading(true);
                    const newProducts = await getMoreProducts(page + 1);
                    if (newProducts.length !== 0) {
                        setPage((prev) => prev + 1);
                        setProducts((prev) => [...prev, ...newProducts]);
                    } else {
                        setIsLastPage(true);
                    }
                    setIsLoading(false);
                }
            },
            {
                threshold: 1.0,
            }
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [page, disableInfiniteScroll]);

    return (
        <div className="p-5 flex flex-col gap-5 pb-40">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {!isLastPage && !disableInfiniteScroll ? (
                <span
                    ref={trigger}
                    style={{
                        marginTop: `${(page + 1) * 10}vh`,
                    }}
                    className="mb-96 text-sm font-semibold bg-orange-500/10 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
                >
                    {isLoading ? "로딩 중" : "Load more"}
                </span>
            ) : null
            }
        </div >
    );
}