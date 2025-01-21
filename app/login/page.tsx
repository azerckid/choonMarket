import FormButton from "@/components/form-btn"
import FormInput from "@/components/form-input"
import SocialLogin from "@/components/social-login"

export default function Login() {
    const handleForm = async (formData: FormData) => {
        "use server";
        await new Promise((resolve) => setTimeout(resolve, 5000))
        console.log(formData.get("email"), formData.get("password"))
        console.log("logged In")
    }
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello</h1>
                <h2 className="text-xl">login with your e-mail and password</h2>
            </div>
            <form action={handleForm}
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
                    errors={[]}
                />
                <FormButton title="LogIn" />
            </form>
            <SocialLogin></SocialLogin>
        </div>
    )
}