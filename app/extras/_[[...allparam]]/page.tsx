import Fonts from "./components/fonts";
import { redirect } from "next/navigation";
export default async function Extras({ params }: { params: { allparam: string[] } }) {
    const { allparam } = await params
    if (!allparam.includes("happyending")) {
        redirect("/")
    }
    return (
        <div className="py-10">
            <Fonts allparam={allparam} />
        </div>
    );
}