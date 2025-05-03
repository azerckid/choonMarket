"use client"
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Button from "@/components/button"
import Input from "@/components/input"
import SocialLogin from "@/components/social-login"
import { useActionState } from "react";
import { login } from "./action";
import { EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Link from "next/link";

interface ActionState {
    success?: boolean;
    message?: string;
    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
}

export default function Login() {
    const [state, action] = useActionState<ActionState, FormData>(login, { success: false, message: "", fieldErrors: {} })
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setIsSuccess(true);
        }
    }, [state]);

    if (isSuccess) {
        redirect("/profile");
    }

    return (
        <div className="flex flex-col gap-6">
            <form action={action}
                className="flex flex-col gap-3">
                <Input
                    name="email"
                    type="email"
                    placeholder="이메일"
                    required
                    minLength={EMAIL_MIN_LENGTH}
                    maxLength={EMAIL_MAX_LENGTH}
                    errors={state?.fieldErrors?.email ?? []}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    errors={state?.fieldErrors?.password ?? []}
                />
                <Button title="로그인" />
            </form>
            <SocialLogin></SocialLogin>
            <Link href="/create-account" className="text-neutral-400 hover:underline underline-offset-4"> &larr; 회원가입으로 가기</Link>
        </div>
    )
}