import { getChatRooms } from "./action";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { formatToTimeAgo } from "@/lib/utils";
import DeleteButton from "./components/delete-button";

export default async function ChatPage() {
    const session = await getSession();
    if (!session?.user?.id) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">로그인이 필요합니다.</p>
            </div>
        );
    }

    const chatRooms = await getChatRooms();

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {chatRooms.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">채팅방이 없습니다.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {chatRooms.map((room) => (
                            <div key={room.id} className="relative">
                                <div className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Link href={`/chat/${room.id}`} className="flex-1">
                                            <div>
                                                <h3 className="font-medium">
                                                    채팅방 {room.id}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {room.messages[0]?.payload || "메시지가 없습니다."}
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {formatToTimeAgo(room.updatedAt.toISOString())}
                                            </span>
                                            <DeleteButton chatRoomId={room.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}