interface FormButtonProps {
    loading: boolean;
    title: string;
}

export default function FormButton({ loading, title }: FormButtonProps) {
    return (
        <button
            disabled={loading}
            className="primary-btn py-2 
            disabled:bg-neutral-400
            disabled:text-neutral-300
            disabled:cursor-not-allowed
            ">{loading ? "Loading..." : title}</button>
    )
}