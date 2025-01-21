interface FormInputProps {
    type: string;
    required: boolean;
    placeholder: string;
    errors: string[];
    name: string;
}

export default function FormInput({ type, required, placeholder, errors, name }: FormInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                className="primary-input" />
            {errors.map((error, index) =>
                <span key={index} className="text-red-500 font-medium">{error}</span>)}

        </div>
    )
}