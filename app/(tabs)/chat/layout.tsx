"use client";

import { ReactNode, Suspense } from "react";

interface ChatLayoutProps {
    children: ReactNode;
}

function LoadingChatList() {
    return (
        <div className="flex flex-col space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-neutral-200/20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-200/20 rounded w-1/4" />
                        <div className="h-3 bg-neutral-200/20 rounded w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                <Suspense fallback={<LoadingChatList />}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
} 