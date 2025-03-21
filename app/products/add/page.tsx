"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./action";
import { useFormState } from "react-dom";

type FormState = {
    fieldErrors?: {
        title?: string[];
        price?: string[];
        description?: string[];
    };
} | null;

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [state, action] = useFormState<FormState, FormData>(uploadProduct, null);


    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            alert("이미지 크기는 2MB를 초과할 수 없습니다.");
            event.target.value = ""; // Reset the input
            return;
        }
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div>
            <form
                className="p-5 flex flex-col gap-5"
                action={action}>
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
                <Input name="title" required placeholder="제목" type="text" errors={state?.fieldErrors?.title} />
                <Input name="price" type="number" required placeholder="가격" errors={state?.fieldErrors?.price} />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="자세한 설명"
                    errors={state?.fieldErrors?.description}
                />
                <Button title="작성 완료" />
            </form>
        </div>
    );
}