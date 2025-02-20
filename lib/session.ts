import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

export const getSession = async () => {
    const cookie = await getIronSession<SessionContent>(await cookies(), {
        cookieName: "cookie-name",
        password: process.env.SESSION_SECRET!,
    });
    return cookie;
}   