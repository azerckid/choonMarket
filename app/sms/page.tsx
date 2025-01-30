"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { useActionState } from "react"
import { smsVerification } from "./action"
import { PHONE_MIN_LENGTH, PHONE_MAX_LENGTH } from "@/lib/constants"

export default function Login() {
    const [state, action] = useActionState(smsVerification, null)
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello SMS Login</h1>
                <h2 className="text-xl">Verify your phone number</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
                <Input
                    name="phone"
                    type="number"
                    placeholder="phone number"
                    required
                    minLength={PHONE_MIN_LENGTH}
                    maxLength={PHONE_MAX_LENGTH}
                    errors={state?.fieldErrors?.phone ?? []}
                />
                <Input
                    name="code"
                    type="number"
                    placeholder="Verification code"
                    required
                    minLength={6}
                    maxLength={6}
                    errors={state?.fieldErrors?.code ?? []}
                />
                <Button title="Verify phone number" />
            </form>
        </div>
    )
}