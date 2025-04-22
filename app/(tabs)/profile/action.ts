"use server"

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/");
}

export async function getUserProducts(userId: number) {
    const products = await db.product.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return products;
} 