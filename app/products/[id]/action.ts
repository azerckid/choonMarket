"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// 세션 확인 헬퍼 함수
async function checkSession() {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다.",
            session: null,
        };
    }
    return { session };
}

// 제품 조회 헬퍼 함수
async function getProductById(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            userId: true,
        },
    });

    if (!product) {
        return {
            error: "상품을 찾을 수 없습니다.",
            product: null,
        };
    }

    return { product };
}

export async function getIsOwner(userId: number) {
    const { session } = await checkSession();
    if (!session) return false;

    return session.user!.id === userId;
}

export async function getProduct(id: number) {
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

export async function deleteProduct(id: number) {
    const { session, error } = await checkSession();
    if (error) return { error };

    const { product, error: productError } = await getProductById(id);
    if (productError) return { error: productError };

    if (product!.userId !== session!.user!.id) {
        return {
            error: "권한이 없습니다.",
        };
    }

    await db.product.delete({
        where: {
            id,
        },
    });

    revalidatePath("/");
    return {
        success: true,
    };
}

export async function createChatRoom(productId: string) {
    const { session, error } = await checkSession();
    if (error) return { error };

    const { product, error: productError } = await getProductById(Number(productId));
    if (productError) return { error: productError };

    // 이미 존재하는 채팅방이 있는지 확인
    const existingRoom = await db.chatRoom.findFirst({
        where: {
            AND: [
                {
                    users: {
                        some: {
                            id: product!.userId,
                        },
                    },
                },
                {
                    users: {
                        some: {
                            id: session!.user!.id,
                        },
                    },
                },
                {
                    productId: Number(productId),
                },
            ],
        },
    });

    if (existingRoom) {
        return {
            roomId: existingRoom.id,
        };
    }

    // 새로운 채팅방 생성
    const room = await db.chatRoom.create({
        data: {
            users: {
                connect: [
                    {
                        id: product!.userId,
                    },
                    {
                        id: session!.user!.id,
                    },
                ],
            },
            productId: Number(productId),
        },
    });

    return {
        roomId: room.id,
    };
} 