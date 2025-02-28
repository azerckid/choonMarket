import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
    const session = await getSession();
    // console.log(request.cookies.getAll());
    // console.log(cookies());
    // console.log(session);
    const pathname = request.nextUrl.pathname;

    if (pathname === "/profile") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/") {
        const response = NextResponse.next();
        response.cookies.set("middleware-cookie", "true");
        return response;
    }

}

export const config = {
    matcher: ["/", "/profile", "/login", "/create-account", "/user/:path*"],
};