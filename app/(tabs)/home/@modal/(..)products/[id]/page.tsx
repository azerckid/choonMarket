import { PhotoIcon } from "@heroicons/react/24/solid";
import { getProduct } from "./action";
import CloseButton from "@/components/close-button";

interface Product {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    userId: number;
    user: {
        id: number;
        username: string;
    };
}

export default async function ModalPage({ params }: { params: { id: string } }) {
    const result = await getProduct(params.id);
    const product = result.success ? result.data : null;

    return (
        <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black left-0 top-0">
            <div className="max-w-screen-sm h-1/2  flex flex-col gap-4 justify-center w-full">
                <div className="relative flex flex-row gap-2 items-center justify-center">
                    <CloseButton id={params.id} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">{product?.title}</h1>
                        <p className="text-neutral-500">{product?.description}</p>
                    </div>
                    <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
                        <PhotoIcon className="h-28" />
                    </div>
                </div>
            </div>
        </div>
    );
}

