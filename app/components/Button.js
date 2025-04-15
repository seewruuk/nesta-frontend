import Link from "next/link";

export default function Button({type, style, title, onClick, disabled, scrolled}) {

    const buttonStyle = {
        primary : " text-[15px] block py-[15px] px-[35px] bg-primary transition-all text-dark text-center hover:bg-primary-hover",
        white : " block py-[15px] px-[35px] border-2 border-black text-black hover:bg-black hover:text-white transition-all text-center",
        black: "block py-[15px] px-[35px] border-2 border-white text-white hover:bg-white hover:text-black transition-all",
    }

    switch (type) {
        case "link":
            return (
                <Link
                    href={`${onClick}`}
                    className={`${buttonStyle[style]}`}
                >
                    {title}

                </Link>
            )
        case "button":
            return (
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`${buttonStyle[style]}`}
                >
                    {title}
                </button>
            )

        case "buttonWhite":
            return (
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`${buttonStyle[style]}`}
                >
                    {title}
                </button>
            )
    }
}