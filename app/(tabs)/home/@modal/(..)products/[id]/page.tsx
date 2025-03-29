"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ModalPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    return (
        <>

            <div className="flex flex-row gap-2 items-center justify-center h-full p-10 bg-pink-500">
                <span>intercepted ID PAGE</span>
                <button
                    onClick={() => window.location.href = `/products/${params.id}`}
                    className=" text-neutral-500 hover:text-neutral-700"
                >
                    <XMarkIcon className="w-6 border-2 border-white rounded-full text-white hover:text-white" />
                </button>
            </div>
        </>
    );
}