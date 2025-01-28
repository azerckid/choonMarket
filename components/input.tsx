import { InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
}

export default function FormInput({ errors = [], name, ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="primary-input"
                {...rest} />
            {errors.map((error, index) =>
                <span key={index} className="text-red-500 font-medium">{error}</span>)}

        </div>
    )
}