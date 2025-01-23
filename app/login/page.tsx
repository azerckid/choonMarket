"use client"
import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import SocialLogin from "@/components/social-login"
import { useActionState } from "react";
import { handleForm } from "./action";

export default function Login() {
    const [state, action] = useActionState(handleForm, {
        errors: [] as string[]
    })
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello</h1>
                <h2 className="text-xl">login with your e-mail and password</h2>
            </div>
            <form action={action}
                className="flex flex-col gap-3">
                <FormInput
                    name="email"
                    type="email"
                    placeholder="your e-mail"
                    required
                    errors={[]}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                    errors={state?.errors ?? []}
                />
                <FormButton title="LogIn" />
            </form>
            <SocialLogin></SocialLogin>
        </div>
    )
}