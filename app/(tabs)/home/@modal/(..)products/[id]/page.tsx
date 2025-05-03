import { getProduct } from "./action";
import { getSession } from "@/lib/session";
import Image from "next/image";
import GobackButton from "@/components/goback-button";
import ViewDetailsButton from "@/components/view-details-button";
import ProductCommentSection from "@/components/product-comment-section";

export default async function ModalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getProduct(id);
    const session = await getSession();
    const product = result.success ? result.data : null;

    return (
        <div className="fixed w-full py-6 h-full z-50 flex items-start justify-center bg-[#205781] left-0 top-0 overflow-y-auto">
            <div className="max-w-screen-sm w-full flex flex-col gap-4 py-8 mb-12 px-4">
                <div className="flex flex-row gap-2 justify-between mb-4 h-16">
                    <div className="relative flex flex-row items-center">
                        <GobackButton />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-center sm:text-left">{product?.title}</h1>
                        {product?.photo ? (
                            <Image
                                src={`${product.photo}/public`}
                                alt={product.title || ""}
                                width={300}
                                height={300}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-[300px] h-[300px] bg-neutral-700 rounded-lg flex items-center justify-center">
                                <span className="text-neutral-400">No image</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 items-end w-full sm:w-auto pr-4">
                        <span className="text-neutral-100">{product?.user.username}</span>
                        <span className="text-neutral-100">
                            {product?.updatedAt
                                ? `${product.updatedAt.toLocaleDateString()}`
                                : `${product?.createdAt?.toLocaleDateString()}`
                            }
                        </span>
                        <span className="text-neutral-100">{product?.price.toLocaleString()} 원</span>
                        <span className="text-neutral-100">{product?.category}</span>
                        <div className="relative flex flex-row items-center">
                            <ViewDetailsButton id={id} />
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-neutral-100 p-4 sm:p-10">{product?.description}</p>
                </div>
                {product && <ProductCommentSection productId={product.id} isLoggedIn={!!session.user} />}
            </div>
        </div>
    );
}

