"use client"
import { useFormStatus } from "react-dom";

interface FormButtonProps {
    title: string;
}

export default function FormButton({ title }: FormButtonProps) {
    const { pending: loading } = useFormStatus();
    return (
        <button
            disabled={loading}
            className="primary-btn py-2 
            disabled:bg-neutral-400
            disabled:text-neutral-300
            disabled:cursor-not-allowed
            ">{loading ? "Loading..." : title}</button>
    )
}