"use client";

import Link from "next/link";
import { formatUsername } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChatListProps, ChatRoom, MessagePayload, UnreadCounts } from "../types";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { getChatRooms } from "../action";
import ChatListSkeleton from "./chat-list-skeleton";

export default function ChatList({ initialRooms, initialUnreadCounts, session }: ChatListProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);
    const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>(initialUnreadCounts);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingUnread, setIsLoadingUnread] = useState(true);

    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const { data: rooms, error } = await supabase
                    .from("chat_rooms")
                    .select(`
                        *,
                        users:chat_room_users(user:users(*)),
                        messages:messages(*)
                    `)
                    .order("updated_at", { ascending: false });

                if (error) throw error;
                setRooms(rooms || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load chat rooms:", error);
                setIsLoading(false);
            }
        };

        loadChatRooms();
    }, [session?.user?.id]);

    useEffect(() => {
        const loadUnreadCounts = async () => {
            try {
                const unreadCountMap: UnreadCounts = {};
                for (const room of rooms) {
                    const { count, error } = await supabase
                        .from("messages")
                        .select("*", { count: "exact", head: true })
                        .eq("chat_room_id", room.id)
                        .eq("is_read", false)
                        .neq("user_id", session?.user?.id);

                    if (!error && count !== null) {
                        unreadCountMap[room.id] = count;
                    }
                }
                setUnreadCounts(unreadCountMap);
                setIsLoadingUnread(false);
            } catch (error) {
                console.error("Failed to load unread counts:", error);
                setIsLoadingUnread(false);
            }
        };

        if (!isLoading) {
            loadUnreadCounts();
        }
    }, [isLoading, session?.user?.id, rooms]);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = supabase
            .channel("chat_rooms")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "chat_rooms",
                },
                (payload) => {
                    console.log("Change received!", payload);
                    if (payload.eventType === "INSERT") {
                        setRooms((prev) => [payload.new as ChatRoom, ...prev]);
                    } else if (payload.eventType === "UPDATE") {
                        setRooms((prev) =>
                            prev.map((room) =>
                                room.id === payload.new.id ? (payload.new as ChatRoom) : room
                            )
                        );
                    } else if (payload.eventType === "DELETE") {
                        setRooms((prev) => prev.filter((room) => room.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id]);

    if (isLoading) {
        return <ChatListSkeleton />;
    }

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>채팅방이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">채팅</h1>
            <div className="space-y-4">
                {rooms.map((room) => {
                    const otherUser = room.users?.find((user) => user.id !== session?.user?.id);
                    const lastMessage = room.messages?.[0];
                    const unreadCount = isLoadingUnread ? null : (unreadCounts[room.id] || 0);

                    return (
                        <Link
                            key={room.id}
                            href={`/chat/${room.id}`}
                            className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">
                                            {formatUsername(otherUser?.username || "알 수 없는 사용자")}
                                        </p>
                                        {!isLoadingUnread && unreadCount !== null && unreadCount > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-400">
                                        {lastMessage?.payload || "아직 메시지가 없습니다."}
                                    </p>
                                    {lastMessage && (
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
} 