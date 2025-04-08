"use client";

import { useState } from "react";
import { sendMessage } from "../action";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";

interface ChatClientProps {
    chatRoom: {
        id: string;
        users: {
            id: number;
            username: string;
            avatar: string | null;
        }[];
        messages: {
            id: number;
            payload: string;
            createdAt: Date;
            user: {
                id: number;
                username: string;
                avatar: string | null;
            };
        }[];
    };
    currentUser: {
        id: number;
        username?: string;
        email?: string;
    };
}

export default function ChatClient({ chatRoom, currentUser }: ChatClientProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        const formData = new FormData();
        formData.append("chatRoomId", chatRoom.id);
        formData.append("content", message);

        await sendMessage(formData);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4">
                {chatRoom.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-2 ${msg.user.id === currentUser.id ? "justify-end" : ""
                            }`}
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
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${msg.user.id === currentUser.id
                                ? "bg-blue-500 text-white"
                                : "bg-neutral-800"
                                }`}
                        >
                            <p className="text-sm">{msg.payload}</p>
                            <span className="text-xs opacity-70">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
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