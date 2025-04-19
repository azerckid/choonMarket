export default function ProfileLoading() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="border-b border-neutral-800 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">프로필</h1>
                </div>
            </div>
            <div className="flex-1 p-4">
                <div className="flex flex-col items-center gap-4">
                    {/* 프로필 이미지 스켈레톤 */}
                    <div className="size-32 rounded-full bg-neutral-800 animate-pulse" />

                    {/* 사용자 이름 스켈레톤 */}
                    <div className="h-6 w-32 bg-neutral-800 rounded animate-pulse" />

                    {/* 프로필 정보 섹션 */}
                    <div className="w-full space-y-4 mt-8">
                        <div className="p-4 rounded-lg bg-neutral-800/50">
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
                                <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-neutral-800/50">
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
                                <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 