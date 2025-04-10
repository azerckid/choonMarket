"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../action";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatUsername, formatToTimeAgo } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import db from "@/lib/db";
import { useParams } from "next/navigation";
import { revalidateChatList } from "@/app/(tabs)/chat/action";

// Supabase 클라이언트 초기화 확인
console.log("ChatClient component initialized");
console.log("Supabase client:", supabase);

interface Message {
    id: number;
    payload: string;
    createdAt: Date;
    user: {
        id: number;
        username: string;
        avatar: string | null;
    };
    status: string;
}

interface ChatClientProps {
    chatRoom: {
        id: string;
        users: {
            id: number;
            username: string;
            avatar: string | null;
        }[];
        messages: Message[];
    };
    currentUser: {
        id: number;
        username?: string;
        email?: string;
        avatar?: string;
    };
}

export default function ChatClient({ chatRoom, currentUser }: ChatClientProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(chatRoom.messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();

    // 메시지 목록 초기화
    useEffect(() => {
        console.log('Chat room users:', chatRoom.users);
        console.log('Initial messages:', chatRoom.messages);

        // 초기 메시지에 사용자 정보 추가
        const messagesWithUserInfo = chatRoom.messages.map(msg => {
            // 메시지 작성자 찾기
            const messageUser = chatRoom.users.find(user => user.id === msg.user.id);
            console.log('Message user:', msg.user.id, messageUser);

            return {
                ...msg,
                user: {
                    ...msg.user,
                    username: messageUser?.username || msg.user.username || "",
                    avatar: messageUser?.avatar || msg.user.avatar || null,
                }
            };
        });
        console.log('Initial messages with user info:', messagesWithUserInfo);
        setMessages(messagesWithUserInfo);
    }, [chatRoom.messages, chatRoom.users]);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Supabase Realtime 구독 설정
    useEffect(() => {
        console.log("Setting up Supabase Realtime subscription for chat room:", chatRoom.id);

        // 채널 생성
        const channel = supabase
            .channel(`chat_${chatRoom.id}`, {
                config: {
                    broadcast: { self: true },
                    presence: { key: currentUser.id.toString() },
                },
            })
            .on('presence', { event: 'sync' }, () => {
                console.log('Presence sync');
                setIsConnected(true);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('Presence join', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('Presence leave', key, leftPresences);
            })
            .on('broadcast', { event: 'new_message' }, ({ payload }) => {
                console.log('Received broadcast message:', payload);

                // 이미 존재하는 메시지인지 확인
                setMessages(prev => {
                    // 이미 동일한 ID의 메시지가 있는지 확인
                    if (prev.some(msg => msg.id === payload.id)) {
                        console.log('Message already exists, skipping:', payload.id);
                        return prev;
                    }

                    // 메시지 작성자 찾기
                    const messageUser = chatRoom.users.find(user => user.id === payload.userId);
                    console.log('Found message user:', messageUser);

                    // 새 메시지를 기존 메시지 목록에 추가
                    const newMessage = {
                        id: payload.id,
                        payload: payload.payload,
                        createdAt: new Date(payload.createdAt),
                        user: messageUser || {
                            id: payload.userId,
                            username: payload.username || "",
                            avatar: payload.avatar || null,
                        },
                        status: "sent",
                    };
                    console.log('Adding new message with user info:', newMessage);
                    return [...prev, newMessage];
                });
            })
            .on('broadcast', { event: 'message_read' }, ({ payload }) => {
                console.log('Message read event received:', payload);
                console.log('Current messages before update:', messages);
                setMessages(prev => {
                    console.log('Previous messages in setMessages:', prev);
                    const updatedMessages = prev.map(msg =>
                        msg.id === payload.messageId ? { ...msg, status: "read" } : msg
                    );
                    console.log('Updated messages in setMessages:', updatedMessages);
                    return updatedMessages;
                });
            })
            .subscribe(async (status, err) => {
                console.log('Subscription status:', status);
                if (err) {
                    console.error('Subscription error:', err);
                    setError(err.message);
                    return;
                }
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                    setError(null);
                    // 구독 후 현재 상태 동기화
                    await channel.track({ user_id: currentUser.id });
                }
            });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
            revalidateChatList();
        };
    }, [chatRoom.id, currentUser.id]);

    useEffect(() => {
        // 메시지가 화면에 표시될 때 상태를 '읽음'으로 업데이트
        const updateMessageStatus = async () => {
            const unreadMessages = messages.filter(msg => msg.user.id !== currentUser.id && msg.status === "sent");
            console.log('Unread messages to update:', unreadMessages);
            for (const msg of unreadMessages) {
                try {
                    console.log('Updating message status for message ID:', msg.id);
                    const response = await fetch(`/api/messages/${msg.id}/read`, { method: 'POST' });
                    const data = await response.json();
                    console.log('Message status update response:', data);

                    // 메시지 상태 업데이트 후 브로드캐스팅
                    const channel = supabase.channel(`chat_${chatRoom.id}`);
                    await channel.send({
                        type: 'broadcast',
                        event: 'message_read',
                        payload: { messageId: msg.id }
                    });
                    console.log('Broadcasted message_read event for message ID:', msg.id);
                } catch (error) {
                    console.error('Error updating message status:', error);
                }
            }
        };
        updateMessageStatus();
    }, [messages, currentUser.id, chatRoom.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            console.log('Sending message:', message);
            const formData = new FormData();
            formData.append("chatRoomId", chatRoom.id);
            formData.append("content", message);

            const result = await sendMessage(formData);
            console.log('Message send result:', result);

            if (result.error) {
                console.error('Error sending message:', result.error);
                setError(result.error);
                return;
            }

            // 새 메시지를 목록에 추가하지 않고 브로드캐스팅만 수행
            if (result.message) {
                // 브로드캐스팅으로 메시지 전송
                const channel = supabase.channel(`chat_${chatRoom.id}`);
                await channel.send({
                    type: 'broadcast',
                    event: 'new_message',
                    payload: {
                        id: result.message.id,
                        payload: result.message.payload,
                        createdAt: result.message.createdAt,
                        userId: currentUser.id,
                        username: currentUser.username,
                        avatar: currentUser.avatar || null,
                    }
                });
            }

            setMessage("");
            setError(null);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('메시지 전송 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {error && (
                <div className="bg-red-500 text-white p-2 text-center">
                    {error}
                </div>
            )}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-hide">
                {messages.map((msg, index) => (
                    <div
                        key={`${msg.id}-${index}`}
                        className={`flex items-start gap-2 ${msg.user.id === currentUser.id ? "justify-end" : ""}`}
                    >
                        {msg.user.id !== currentUser.id && (
                            <div className="w-10 h-10 mr-2 ml-2 p-5 relative overflow-hidden rounded-full">
                                {msg.user.avatar ? (
                                    <Image
                                        src={msg.user.avatar}
                                        alt={formatUsername(msg.user.username)}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <UserIcon className="size-8" />
                                )}
                            </div>
                        )}
                        <div className={`flex flex-col ${msg.user.id === currentUser.id ? "items-end" : ""}`}>
                            {msg.user.id === currentUser.id ? (
                                <div className="max-w-[100%] rounded-lg px-3 py-2 bg-blue-500 text-white">
                                    <p className="text-sm text-right break-words whitespace-normal">{msg.payload}</p>
                                    <p className="text-xs text-gray-300 mt-1 text-right">
                                        {msg.status === "read" ? "읽음" : "전송됨"}
                                    </p>
                                </div>
                            ) : (
                                <div className="max-w-[100%] rounded-lg px-3 py-2 bg-gray-100 text-black">
                                    <p className="text-sm break-words whitespace-normal">{msg.payload}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {formatToTimeAgo(msg.createdAt.toString())}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 bg-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        전송
                    </button>
                </div>
            </form>
        </div>
    );
} 