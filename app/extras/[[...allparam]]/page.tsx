import Fonts from "./components/fonts";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Extras({ params }: { params: { allparam: string[] } }) {
    const { allparam } = await params
    if (!allparam.includes("happyending")) {
        redirect("/")
    }
    const image = "https://imagedelivery.net/qElPWuf6dh3XwlbK50HaCg/9f324b91-7b2b-4d8d-533d-08ccbb5f5b00"
    return (
        <div className="py-10">
            <Fonts allparam={allparam} />
            <Image src={`${image}/public`}
                width={500}
                height={500}
                alt="happyending"
                placeholder="blur"
                blurDataURL={image}
                className="w-full h-full object-cover"
            />
        </div>
    );
}