import { getSession } from "@/lib/session";
import { getChatRooms, getUnreadMessageCounts } from "./action";
import ChatList from "./components/chat-list";

export default async function ChatPage() {
    const session = await getSession();
    const rooms = await getChatRooms();

    let unreadCounts = {};
    if (rooms.length > 0 && session?.user?.id) {
        const roomIds = rooms.map(room => room.id);
        unreadCounts = await getUnreadMessageCounts(roomIds, session.user.id);
    }

    return (
        <ChatList
            initialRooms={rooms}
            initialUnreadCounts={unreadCounts}
            session={{
                user: session?.user ? {
                    id: session.user.id,
                    username: session.user.username,
                    avatar: session.user.avatar
                } : undefined
            }}
        />
    );
}