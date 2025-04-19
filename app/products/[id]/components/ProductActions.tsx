"use client";

import { formatToWon } from "@/lib/utils";
import { createChatRoom } from "../action";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductActionsProps {
    id: number;
    price: number;
}

export default function ProductActions({ id, price }: ProductActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChatRoom = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const result = await createChatRoom(id.toString());
            if ("error" in result) {
                console.error("Error creating chat room:", result.error);
                return;
            }
            router.push(`/chat/${result.roomId}`);
        } catch (error) {
            console.error("Error creating chat room:", error);
        }
    };

    return (
        <div className="flex justify-between items-center p-5">
            <span className="font-semibold text-xl">
                price : {formatToWon(price)}원
            </span>
            <button
                onClick={handleChatRoom}
                disabled={isLoading}
                className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "채팅방 생성 중..." : "채팅하기"}
            </button>
        </div>
    );
} 