import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import db from "@/lib/db";
import Button from "@/components/button";
import { logout } from "./action";

export default async function Profile() {
    const session = await getSession();
    if (!session.id) {
        notFound();
    }
    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            username: true,
            email: true,
            phone: true,
            avatar: true,
        }
    });
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h2 className="text-xl">Welcome, {user.username}!</h2>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <img src={user.avatar || "/default-avatar.png"} alt="avatar" className="w-16 h-16 rounded-full" />
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phone || "Not set"}</p>
                </div>
                <form action={logout}>
                    <Button title="Logout" />
                </form>
            </div>
        </div>
    );
}