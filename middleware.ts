import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
    const session = await getSession();
    // console.log(request.cookies.getAll());
    // console.log(cookies());
    console.log(session);

    if (request.nextUrl.pathname === "/profile") {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: "/",
};