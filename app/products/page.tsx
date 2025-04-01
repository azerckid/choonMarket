import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    userId: number;
}

async function getProducts() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [] };
    }
}

export default async function ProductsPage() {
    const { products } = await getProducts();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>

            <Suspense fallback={<div>Loading products...</div>}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products && products.length > 0 ? (
                        products.map((product: Product) => (
                            <Link href={`/products/${product.id}`} key={product.id}>
                                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    {product.photo ? (
                                        <div className="aspect-square relative">
                                            <Image
                                                src={product.photo}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No image</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h2 className="font-semibold">{product.title}</h2>
                                        <p className="text-orange-500 font-medium">
                                            {product.price.toLocaleString()} 원
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p>No products found</p>
                            <Link href="/products/add" className="text-orange-500 hover:underline mt-2 inline-block">
                                Add a product
                            </Link>
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
} 