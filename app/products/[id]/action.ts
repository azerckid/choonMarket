"use server";

import { productSchema } from "@/app/(tabs)/home/add/zodSchema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// ... existing code ...

// 제품 삭제 함수
export async function deleteProduct(id: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            fieldErrors: {
                title: ["로그인이 필요합니다."]
            }
        };
    }

    // 제품 소유자 확인
    const product = await db.product.findUnique({
        where: { id: Number(id) },
        select: { userId: true }
    });

    if (!product) {
        return {
            fieldErrors: {
                title: ["제품을 찾을 수 없습니다."]
            }
        };
    }

    if (product.userId !== session.user.id) {
        return {
            fieldErrors: {
                title: ["삭제 권한이 없습니다."]
            }
        };
    }

    await db.product.delete({
        where: { id: Number(id) }
    });

    // 캐시 갱신
    revalidateTag("product-detail");
    revalidateTag("product-title");
    revalidateTag("product-list");
    revalidateTag("xxxx");

    redirect("/home");
} 