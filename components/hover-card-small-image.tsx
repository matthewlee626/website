import { HoverCardTrigger } from "./ui/hover-card";
import { HoverCardContent } from "./ui/hover-card";
import { HoverCard } from "./ui/hover-card";
import Image from "next/image";

export function HoverCardSmallImage({ text, imageSrc, alt, caption }: { text: string, imageSrc: string, alt: string, caption: string }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="text-[#e6f0ff] underline">{text}</span>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col items-center">
                    <Image src={imageSrc} alt={alt} className="w-full" width={100} height={100}/>
                    <div className="text-center px-4">
                        <p>{caption}</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}