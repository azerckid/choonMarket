import { NextResponse } from "next/server";

export function GET() {
    const baseURL = "https://github.com/login/oauth/authorize";
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.AUTH_CALLBACK_URL!,
        scope: "read:user, user:email",
        allow_signup: "true",
    }
    const url = `${baseURL}?${new URLSearchParams(params).toString()}`;
    console.log(url);
    return NextResponse.redirect(url);
}   