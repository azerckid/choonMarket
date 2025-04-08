"use client";

import {
    HomeIcon as SolidHomeIcon,
    NewspaperIcon as SolidNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
    VideoCameraIcon as SolidVideoCameraIcon,
    UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
    HomeIcon as OutlineHomeIcon,
    NewspaperIcon as OutlineNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
    VideoCameraIcon as OutlineVideoCameraIcon,
    UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
    const pathname = usePathname();

    // add 페이지에서는 TabBar를 보여주지 않음
    if (pathname === "/home/add") {
        return null;
    }

    return (
        <div className="fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-900">
            <Link
                href="/home"
                className={`flex flex-col items-center gap-1 ${pathname === "/home" ? "text-orange-500" : "text-neutral-500"
                    }`}
            >
                {pathname === "/home" ? (
                    <SolidHomeIcon className="w-6 h-6" />
                ) : (
                    <OutlineHomeIcon className="w-6 h-6" />
                )}
                <span>홈</span>
            </Link>
            <Link
                href="/life"
                className={`flex flex-col items-center gap-1 ${pathname === "/life" ? "text-orange-500" : "text-neutral-500"
                    }`}
            >
                {pathname === "/life" ? (
                    <SolidNewspaperIcon className="w-6 h-6" />
                ) : (
                    <OutlineNewspaperIcon className="w-6 h-6" />
                )}
                <span>동네생활</span>
            </Link>
            <Link
                href="/chat"
                className={`flex flex-col items-center gap-1 ${pathname === "/chat" ? "text-orange-500" : "text-neutral-500"
                    }`}
            >
                {pathname === "/chat" ? (
                    <SolidChatIcon className="w-6 h-6" />
                ) : (
                    <OutlineChatIcon className="w-6 h-6" />
                )}
                <span>채팅</span>
            </Link>
            <Link
                href="/live"
                className={`flex flex-col items-center gap-1 ${pathname === "/live" ? "text-orange-500" : "text-neutral-500"
                    }`}
            >
                {pathname === "/live" ? (
                    <SolidVideoCameraIcon className="w-6 h-6" />
                ) : (
                    <OutlineVideoCameraIcon className="w-6 h-6" />
                )}
                <span>라이브</span>
            </Link>
            <Link
                href="/profile"
                className={`flex flex-col items-center gap-1 ${pathname === "/profile" ? "text-orange-500" : "text-neutral-500"
                    }`}
            >
                {pathname === "/profile" ? (
                    <SolidUserIcon className="w-6 h-6" />
                ) : (
                    <OutlineUserIcon className="w-6 h-6" />
                )}
                <span>나의 당근</span>
            </Link>

        </div>
    );
}