"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// 타입 정의
interface User {
    id: number;
    username: string;
    avatar: string | null;
}

interface Message {
    id: string;
    payload: string;
    createdAt: Date;
    status: string;
}

interface ChatRoom {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
    users: User[];
    messages: Message[];
}

export async function getCurrentSession() {
    return await getSession();
}

export async function getChatRooms(): Promise<ChatRoom[]> {
    const session = await getSession();
    if (!session?.user?.id) return [];

    const rooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: session.user.id
                }
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            },
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    payload: true,
                    createdAt: true,
                    status: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return rooms as ChatRoom[];
}

export async function getUnreadMessageCounts(roomIds: string[], userId: number): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    for (const roomId of roomIds) {
        const unreadMessages = await db.message.count({
            where: {
                chatRoomId: roomId,
                userId: { not: userId },
                status: "sent"
            }
        });
        counts[roomId] = unreadMessages;
    }

    return counts;
}

export async function deleteChatRoom(chatRoomId: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다."
        };
    }

    // 채팅방 참여자 확인
    const chatRoom = await db.chatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
            users: {
                where: {
                    id: session.user.id
                }
            }
        }
    });

    if (!chatRoom) {
        return {
            error: "채팅방을 찾을 수 없습니다."
        };
    }

    if (chatRoom.users.length === 0) {
        return {
            error: "삭제 권한이 없습니다."
        };
    }

    // 채팅방과 관련된 모든 메시지 삭제
    await db.message.deleteMany({
        where: { chatRoomId }
    });

    // 채팅방 삭제
    await db.chatRoom.delete({
        where: { id: chatRoomId }
    });

    revalidatePath("/chat");
    return { success: true };
} 