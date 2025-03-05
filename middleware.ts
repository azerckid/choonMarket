import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

interface PublicOnlyUrls {
    [key: string]: boolean;
}

const publicOnlyUrls: PublicOnlyUrls = {
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/": true,
}

export default async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/products", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};