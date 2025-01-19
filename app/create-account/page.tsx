import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import SocialLogin from "@/components/social-login"

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
            <SocialLogin></SocialLogin>
        </div>
    )
}