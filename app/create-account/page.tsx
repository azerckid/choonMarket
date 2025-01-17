import Link from "next/link"
import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"

export default function CreateAccount() {
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello</h1>
                <h2 className="text-xl">fill in the form below to join!</h2>
            </div>
            <form className="flex flex-col gap-3">
                <FormInput
                    type="text"
                    placeholder="Username"
                    required
                    errors={[]}
                />
                <FormInput
                    type="email"
                    placeholder="your e-mail"
                    required
                    errors={[]}
                />
                <FormInput
                    type="password"
                    placeholder="password"
                    required
                    errors={[]}
                />
                <FormInput
                    type="password"
                    placeholder="confirm password"
                    required
                    errors={[]}
                />
                <FormButton loading={false} title="Create Account" />
            </form>
            <div className="w-full h-px bg-neutral-500"></div>
            <div className="flex items-center justify-center">
                <Link href={"/sms"} className="primary-btn flex items-center justify-center gap-3">
                    <span><ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" /></span>
                    <span>Sign up with SMS</span>
                </Link>
            </div>
        </div>
    )
}