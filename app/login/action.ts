"use server"

export const handleForm = async (prevState: any, formData: FormData) => {
    console.log(prevState)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log(formData.get("email"), formData.get("password"))
    console.log("logged In")
    return {
        errors: ["hello this is server", "hello again"]
    }
}