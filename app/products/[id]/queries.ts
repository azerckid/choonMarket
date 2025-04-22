import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";

/**
 * Retrieves a product by its ID with user information
 * @param {number} id - The ID of the product to retrieve
 * @returns {Promise<any>} The product data or null if not found
 */
async function getProduct(id: number) {
    try {
        const product = await db.product.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                photo: true,
                userId: true,
                category: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });
        return product;
    } catch {
        return null;
    }
}

/**
 * Cached version of getProduct function
 */
export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "xxxx"],
});

/**
 * Retrieves basic product information for metadata
 * @param {number} id - The ID of the product
 * @returns {Promise<any>} Basic product information
 */
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

/**
 * Cached version of getProductTitle function
 */
export const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title", "xxxx"],
}); 