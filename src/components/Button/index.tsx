import { MouseEventHandler } from "react";

type ButtonProps = {
    type?: "button" | "submit" | "reset"
    src: string
    alt: string
    className?: string
    disabled?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>

}

export default function Button({ type = "button", src, alt, className, disabled, onClick }: ButtonProps) {

    return (
        <button type={type} className={className} disabled={disabled} onClick={onClick}>
            <img src={src} alt={alt} />
        </button>
    );
}