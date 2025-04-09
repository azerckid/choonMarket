"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";

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