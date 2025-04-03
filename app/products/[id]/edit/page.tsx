"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";
import { getProduct, getUploadUrl, updateProduct } from "./action";
import { productSchema, ProductType } from "@/app/(tabs)/home/add/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";



export default function EditProduct({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductType>({
        resolver: zodResolver(productSchema)
    });

    const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("이미지 크기는 2MB를 초과할 수 없습니다.");
            event.target.value = "";
            return;
        }
        setPreview(URL.createObjectURL(file));
        const { success, result } = await getUploadUrl();
        if (!success) {
            alert("이미지 업로드에 실패했습니다.");
            return;
        }
        setFile(file);
        const { id, uploadURL } = result;
        setUploadUrl(uploadURL);
        setValue("photo", `https://imagedelivery.net/qElPWuf6dh3XwlbK50HaCg/${id}`);
    };

    const onSubmit = handleSubmit(async (data: ProductType) => {
        console.log("수정된 제품 정보:", {
            title: data.title,
            price: data.price,
            description: data.description,
            photo: data.photo
        });

        try {
            let photoUrl = data.photo;

            // 새 이미지가 선택된 경우에만 Cloudflare 업로드 진행
            if (file) {
                const cloudflareForm = new FormData();
                cloudflareForm.append("file", file);
                const response = await fetch(uploadUrl, {
                    method: "post",
                    body: cloudflareForm,
                });
                if (response.status !== 200) {
                    throw new Error("이미지 업로드에 실패했습니다.");
                }
                const { result } = await response.json();
                if (!result || !result.variants || !result.variants[0]) {
                    throw new Error("이미지 업로드 응답이 올바르지 않습니다.");
                }
                photoUrl = `https://imagedelivery.net/qElPWuf6dh3XwlbK50HaCg/${result.id}`;
            }

            const formData = new FormData();
            formData.append("photo", photoUrl);
            formData.append("title", data.title);
            formData.append("price", data.price.toString());
            formData.append("description", data.description);

            console.log("서버로 전송할 데이터:", {
                photo: photoUrl,
                title: data.title,
                price: data.price,
                description: data.description
            });

            const result = await updateProduct(id, formData);
            if (result.success) {
                router.push(`/products/${id}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert(error instanceof Error ? error.message : "제품 수정 중 오류가 발생했습니다.");
        }
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                console.log("Fetched product data:", data);
                if (data) {
                    setValue("title", data.title);
                    setValue("price", data.price);
                    setValue("description", data.description);
                    setValue("photo", data.photo);
                    setPreview(data.photo);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("제품 정보를 불러오는데 실패했습니다.");
                router.push(`/products/${id}`);
            }
        };
        fetchProduct();
    }, [id, setValue, router]);

    return (
        <div>
            <form onSubmit={onSubmit} className="p-5 flex flex-col gap-5">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
                    style={{
                        backgroundImage: `url(${preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {preview ? (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setPreview("");
                                setFile(null);
                            }}
                            className="w-full h-full bg-black/50 text-white flex items-center justify-center"
                        >
                            <XMarkIcon className="w-10" />
                        </div>
                    ) : (
                        <>
                            <PhotoIcon className="w-20" />
                            <div className="text-neutral-400/75 text-sm">사진을 추가해주세요.</div>
                        </>
                    )}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <Input
                    required
                    placeholder="제목"
                    type="text"
                    {...register("title")}
                    errors={errors?.title?.message ? [errors.title.message] : undefined}
                />
                <Input
                    type="number"
                    required
                    placeholder="가격"
                    {...register("price")}
                    errors={errors?.price?.message ? [errors.price.message] : undefined}
                />
                <Input
                    type="text"
                    required
                    placeholder="자세한 설명"
                    {...register("description")}
                    errors={errors?.description?.message ? [errors.description.message] : undefined}
                />
                <Button title="수정 완료" />
            </form>
        </div>
    );
}