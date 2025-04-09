"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../action";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatUsername, formatToTimeAgo } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
                };
                console.log('Adding new message with user info:', newMessage);
                setMessages(prev => [...prev, newMessage]);
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
        };
    }, [chatRoom.id, currentUser.id]);

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

            // 새 메시지를 목록에 추가
            if (result.message) {
                const newMessage = {
                    id: result.message.id,
                    payload: result.message.payload,
                    createdAt: new Date(result.message.createdAt),
                    user: {
                        id: currentUser.id,
                        username: currentUser.username || "",
                        avatar: currentUser.avatar || null,
                    },
                };
                setMessages(prev => [...prev, newMessage]);

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
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((msg, index) => (
                    <div
                        key={`${msg.id}-${index}`}
                        className={`flex items-start gap-2 ${msg.user.id === currentUser.id ? "justify-end" : ""}`}
                    >
                        {msg.user.id !== currentUser.id && (
                            <div className="relative size-8 overflow-hidden rounded-full">
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
                        {msg.user.id === currentUser.id ? (
                            <div className="max-w-[70%] rounded-lg p-3 bg-blue-500 text-white">
                                <p className="text-sm">{msg.payload}</p>
                                <span className="text-xs opacity-70">
                                    {formatToTimeAgo(msg.createdAt.toString())}
                                </span>
                            </div>
                        ) : (
                            <div className="max-w-[70%] rounded-lg p-3 bg-neutral-800">
                                <p className="text-sm">{msg.payload}</p>
                                <span className="text-xs opacity-70">
                                    {formatToTimeAgo(msg.createdAt.toString())}
                                </span>
                            </div>
                        )}
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