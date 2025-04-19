export default function ChatLoading() {
    return (
        <div className="flex flex-col h-screen">
            <div className="border-b border-neutral-800 p-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="size-10 rounded-full bg-neutral-800/20 animate-pulse" />
                    <div className="flex flex-col gap-1">
                        <div className="h-4 w-24 bg-neutral-800/20 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-neutral-800/20 rounded animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                            <div className="size-12 rounded-full bg-neutral-700/20" />
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-neutral-700/20 rounded mb-2" />
                                <div className="h-3 w-24 bg-neutral-700/20 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 