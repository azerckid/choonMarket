import db from "@/lib/db";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { formatUsername } from "@/lib/utils";

async function getChatRooms() {
    const session = await getSession();
    if (!session?.user?.id) return [];

    const rooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: session.user.id
                }
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            },
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    payload: true
                }
            }
        }
    });

    return rooms;
}

export default async function ChatPage() {
    const session = await getSession();
    const rooms = await getChatRooms();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">채팅</h1>
            <div className="space-y-4">
                {rooms.map((room) => {
                    const otherUser = room.users.find(
                        (user) => user.id !== session?.user?.id
                    );

                    return (
                        <Link
                            key={room.id}
                            href={`/chat/${room.id}`}
                            className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {formatUsername(otherUser?.username || "알 수 없는 사용자")}
                                    </p>
                                    <p className="text-sm text-neutral-400">
                                        {room.messages[0]?.payload || "아직 메시지가 없습니다."}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {rooms.length === 0 && (
                    <p className="text-center text-neutral-400">
                        아직 채팅방이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
}