"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./action";
import { productSchema, ProductType } from "./zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import GoBackButton from "@/components/goback-button";
import { Category } from "@prisma/client";

// type FormState = {
//     fieldErrors?: {
//         title?: string[];
//         price?: string[];
//         description?: string[];
//     };
// } | null;

export default function AddProduct() {
    const router = useRouter();
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductType>({ resolver: zodResolver(productSchema) });

    const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("이미지 크기는 2MB를 초과할 수 없습니다.");
            event.target.value = ""; // Reset the input
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
        if (!file) {
            return {
                fieldErrors: {
                    title: ["이미지를 선택해주세요."]
                }
            };
        }
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);
        try {
            const response = await fetch(uploadUrl, {
                method: "post",
                body: cloudflareForm,
            });
            if (response.status !== 200) {
                return {
                    fieldErrors: {
                        title: ["이미지 업로드에 실패했습니다."]
                    }
                };
            }
            const { result } = await response.json();
            if (!result || !result.variants || !result.variants[0]) {
                return {
                    fieldErrors: {
                        title: ["이미지 업로드 응답이 올바르지 않습니다."]
                    }
                };
            }

            const formData = new FormData();
            formData.append("photo", data.photo);
            formData.append("title", data.title);
            formData.append("price", data.price.toString());
            formData.append("description", data.description);
            formData.append("category", data.category);

            return uploadProduct(formData);
        } catch (error) {
            console.error(error);
            return {
                fieldErrors: {
                    title: ["이미지 업로드 중 오류가 발생했습니다."]
                }
            };
        }
    })

    const onValid = async () => { await onSubmit() }

    return (
        <div>
            <div className="flex justify-between items-center p-4 relative">
                <GoBackButton href="/home" />
                <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">상품 등록</h1>
            </div>
            <form
                action={onValid}
                className="p-5 flex flex-col gap-5">
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
                                router.push("/home");
                            }}
                            className="w-full h-full bg-black/50 text-white"
                        >
                            <XMarkIcon className="w-10" />
                        </div>
                    ) : (
                        <>
                            <PhotoIcon className="w-20" />
                            <div className="text-neutral-400 text-sm">사진을 추가해주세요.</div>
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
                <select
                    {...register("category")}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
                >
                    <option value="" className="bg-neutral-800">카테고리 선택</option>
                    {Object.values(Category).map((category) => (
                        <option key={category} value={category} className="bg-neutral-800">
                            {category}
                        </option>
                    ))}
                </select>
                {errors?.category?.message && (
                    <span className="text-red-500 text-sm">{errors.category.message}</span>
                )}
                <Button title="작성 완료" />
            </form>
        </div>
    );
}