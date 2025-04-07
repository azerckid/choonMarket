import { metadata } from "./metadata";

export { metadata };

export default function LifeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-900">
            <div className="max-w-screen-md mx-auto">
                {children}
            </div>
        </div>
    );
} 