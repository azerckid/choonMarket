import { ReactNode } from "react";

interface ExtrasLayoutProps {
    children: ReactNode;
}

export default function ExtrasLayout({ children }: ExtrasLayoutProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-neutral-900 rounded-lg p-6 shadow-lg">
                {children}
            </div>
        </div>
    );
} 