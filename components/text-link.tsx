import Link from "next/link";

export function TextLink({text, href} : {text: string, href: string}){
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <span className="text-[#e6f0ff] underline">
                {text}
            </span>
        </Link>
    )
}