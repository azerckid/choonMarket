import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import authenticateUser from "@/lib/auth";

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

    // Add request to get user's email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${accessTokenData.access_token}`,
        },
        cache: "no-cache",
    });
    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find((email: any) => email.primary)?.email || emailData[0]?.email;

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

    // to make distinguish between githubs user and normal user
    const newUser = await db.user.create({
        data: {
            github_id: id + "",
            username: `github_${login}`,
            avatar: avatar_url,
            email: primaryEmail,
        },
        select: {
            id: true,
        },
    });

    // to make login function
    authenticateUser(newUser.id + "");
    return redirect("/profile");

    //todo: 

    // to make distinguish between githubs user and normal user
    // to make getting email from github
    // to make seperating each fetch request

}