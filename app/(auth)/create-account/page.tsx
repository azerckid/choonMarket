"use client";

import { useState, useEffect, useActionState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./action";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "@/lib/constants";


export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);
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
    <div className="flex flex-col gap-10">
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="사용자 이름"
          required
          errors={state?.fieldErrors?.username ?? []}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
        />
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
          errors={state?.fieldErrors?.password ?? []}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          required
          errors={state?.fieldErrors?.confirmPassword ?? []}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
        />
        <Button title="회원가입" />
      </form>
      <SocialLogin></SocialLogin>
      <Link href="/login" className="text-neutral-400 hover:underline underline-offset-4"> &larr; 로그인으로 가기</Link>
    </div>
  );
}
