import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function CreateAccount() {
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello</h1>
                <h2 className="text-xl">fill in the form below to join!</h2>
            </div>
            <form className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <input type="text"
                        placeholder="Username"
                        required
                        className="primary-input" />
                    <span className="text-red-500 font-medium">Input error</span>
                </div>
                <button className="primary-btn py-2">Create account</button>
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