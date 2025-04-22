import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Button from "@/components/button";
import { logout, getUserProducts } from "./action";
import { formatUsername } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import ProductList from "@/components/product-list";

export default async function Profile() {
    const session = await getSession();

    // 세션이 없거나 사용자 ID가 없으면 로그인 페이지로 리다이렉트
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            id: true,  // ID도 함께 조회
            username: true,
            email: true,
            phone: true,
            avatar: true,
        }
    });

    // 사용자 데이터가 없으면 로그인 페이지로 리다이렉트
    if (!user) {
        redirect("/login");
    }

    const products = await getUserProducts(user.id);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col items-center gap-2 *:font-medium">
                <Suspense fallback={<div>Loading...</div>}>
                    <h2 className="text-xl">Welcome, {formatUsername(user.username)}!</h2>
                </Suspense>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="flex justify-center">
                            <Image
                                src={user.avatar || "/default-avatar.png"}
                                alt={`${user.username}'s avatar`}
                                width={80}
                                height={80}
                                className="rounded-full border-4 border-white/20"
                            />
                        </div>
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>
                        <p><span className="font-medium">Phone:</span> {user.phone || "Not set"}</p>
                    </Suspense>
                </div>
                <form action={logout}>
                    <Button title="Logout" />
                </form>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">내가 등록한 상품</h3>
                <ProductList initialProducts={products} />
            </div>
        </div>
    );
}