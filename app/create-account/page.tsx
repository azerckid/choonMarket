"use client";
import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { createAccount } from "./action";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);
  console.log("state", state);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello</h1>
        <h2 className="text-xl">fill in the form below to join!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors?.username ?? []}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="your e-mail"
          required
          errors={state?.fieldErrors?.email ?? []}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
          errors={state?.fieldErrors?.password ?? []}
        />
        <FormInput
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
          required
          errors={state?.fieldErrors?.confirmPassword ?? []}
        />
        <FormButton title="Create Account" />
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
}
