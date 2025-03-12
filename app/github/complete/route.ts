import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return notFound();
    }
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();
    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });
    const accessTokenData = await accessTokenResponse.json();
    if ("error" in accessTokenData) {
        return new Response(null, {
            status: 400,
        });
    }
    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessTokenData.access_token}`,
        },
        cache: "no-cache",
    });
    const userData = await userResponse.json();
    if ("error" in userData) {
        return new Response(null, {
            status: 400,
        });
    }
    const { id, login, avatar_url } = userData;

    const user = await db.user.findUnique({
        where: { github_id: id + "" },
        select: {
            id: true,
        },
    });

    if (user) {
        const session = await getSession();
        session.user = { id: user.id };
        await session.save();
        return redirect("/profile");
    }
    const newUser = await db.user.create({
        data: {
            github_id: id + "",
            username: `github_${login}`,
            avatar: avatar_url,
        },
        select: {
            id: true,
        },
    });

    const session = await getSession();
    session.user = { id: newUser.id };
    await session.save();
    return redirect("/profile");
}