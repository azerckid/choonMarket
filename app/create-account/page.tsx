"use client"
import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import SocialLogin from "@/components/social-login"
import { useActionState } from "react"
import { createAccount } from "./action"

export default function CreateAccount() {
    const [state, action] = useActionState(createAccount, null)
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
                />
                <FormInput
                    name="email"
                    type="email"
                    placeholder="your e-mail"
                    required
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                />
                <FormInput
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    required
                />
                <FormButton title="Create Account" />
            </form>
            <span>{state?.message}</span>
            <SocialLogin></SocialLogin>
        </div>
    )
}