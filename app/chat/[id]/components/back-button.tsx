"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function BackButton() {
    return (
        <Link
            href="/chat"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-700"
        >
            <ArrowLeftIcon className="w-5 h-5 text-neutral-400" />
        </Link>
    );
} 