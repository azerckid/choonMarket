import { Category } from "@prisma/client";

interface ProductDetailsProps {
    title: string;
    description: string;
    category: Category;
}

export default function ProductDetails({ title, description, category }: ProductDetailsProps) {
    return (
        <div className="p-5 pb-10">
            <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <span className="text-sm bg-neutral-700 text-white px-2 py-1 rounded-md">{category}</span>
            </div>
            <p>{description}</p>
        </div>
    );
} 