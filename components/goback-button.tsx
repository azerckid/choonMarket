"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface GoBackButtonProps {
    className?: string;
}

export default function GoBackButton({ className = "" }: GoBackButtonProps) {
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };

    return (
        <button
            onClick={onCloseClick}
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors ${className}`}
        >
            <ArrowLeftIcon className="w-5 h-5 text-neutral-400" />
        </button>
    );
} 