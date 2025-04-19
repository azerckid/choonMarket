import GoBackButton from "@/components/goback-button";

interface ProductHeaderProps {
    id: number;
}

export default function ProductHeader({ id }: ProductHeaderProps) {
    return (
        <div className="p-3 text-lg text-neutral-400 z-10 flex items-center gap-2">
            <GoBackButton href="/home" />
            <span>Product #{id}</span>
        </div>
    );
} 