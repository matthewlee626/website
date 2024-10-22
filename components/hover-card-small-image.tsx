import { TextLink } from "./text-link";
import { HoverCardTrigger } from "./ui/hover-card";
import { HoverCardContent } from "./ui/hover-card";
import { HoverCard } from "./ui/hover-card";
import Image from "next/image";

export function HoverCardSmallImage(
    { text, imageSrc, alt, caption, href }: 
    { text: string, imageSrc: string, alt: string, caption: string, href: string }
) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <TextLink text={text} href={href} />
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col items-center">
                    <Image src={imageSrc} alt={alt} className="w-full" width={100} height={100} priority/>
                    <div className="text-center px-4">
                        <p>{caption}</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}