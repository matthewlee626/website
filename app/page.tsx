import Image from "next/image";
import Link from "next/link";
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, GitHubLogoIcon} from "@radix-ui/react-icons"
import { TextLink } from "@/components/text-link";


export default function Home() {
  return (
    <div className={`flex flex-cols justify-center items-center w-full p-8 md:h-screen font-sans`}>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-12 md:max-w-3xl md:place-items-center p-12 md:p-4">
        <div className="col-span-1 flex flex-row justify-center h-full">
          <div className="flex flex-col gap-4 justify-center h-full">
            <div className="flex flex-col items-center text-center border-4 border-dashed border-white rounded-lg p-4 gap-4">
              <Image
                src="/pfp.png"
                alt="A picture of me taken in Hakone. 我的棨子。"
                width={200}
                height={200}
                priority={true}
              />
              <p>📍 Hakone, Kantō</p>
            </div>
            <div className="border-4 border-solid border-white rounded-lg p-4 text-center">
              <ul>
                <li>
                  <TextLink 
                    text="Travels." 
                    href="/travels" 
                  />
                </li>
                <li><TextLink text="Thoughts." href="/thoughts" /></li>
              </ul>
            </div>
            <div className="border-4 border-solid border-white rounded-lg p-4 flex flex-row justify-center gap-5">
              <Link 
                href="https://www.instagram.com/matthewlee.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <InstagramLogoIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link 
                href="https://www.linkedin.com/in/matthewlee626" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <LinkedInLogoIcon className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link 
                href="https://twitter.com/matthewlee626" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <TwitterLogoIcon className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://github.com/matthewlee626" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GitHubLogoIcon className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">
              How&apos;s it going? While you&apos;re here...
            </h1>
            <p>
              I&apos;m a software engineer, travel addict, and social-put-together-er based in the lovely city of Stanford, CA. I&apos;m currently completing my MS in Computer Science at <TextLink text="Stanford University" href="https://www.stanford.edu"/> and graduated with a BA in Computer Science + Data Science at <TextLink text="UC Berkeley" href="https://www.berkeley.edu"/>. Before that, I grew up in the sunny SoCal suburbs of the San Gabriel Valley.
            </p>
            <p>
              I previously helped build the best prompt-to-website developer platform at <TextLink text="v0 by Vercel" href="https://v0.dev"/>, engineered tools for automated creator growth at <TextLink text="Patreon" href="https://www.patreon.com"/>, explored the future of prototyping at <TextLink text="Figma" href="https://www.figma.com"/>, and made infrastructure better at <TextLink text="Uber" href="https://www.uber.com"/>.
            </p>
            <p>
              My <TextLink text="academic interests" href="https://orcid.org/0000-0002-0863-7415" /> center around developing human-centric representations of AI models to enhance their integration and effectiveness in end-user systems. Currently, I&apos;m building infrastructure to test algorithmic impacts in social media. My previous work includes <TextLink text="developing LLM-enabled tools for writing with speech" href="https://doi.org/10.1145/3613904.3642217"/> and <TextLink text="analyzing case studies on the prompt design process" href="https://doi.org/10.1145/3563657.3596138"/>.
            </p>
            <p>
              I&apos;m particularly fond of my time directing <TextLink text="Cal Hacks" href="https://hackberkeley.org/"/>, Berkeley&apos;s best hackathon organizing club. In my free time, I love <TextLink text="stargazing" href="https://shop.astronomerswithoutborders.org/products/awb-onesky-reflector-telescope"/>, collecting <TextLink text="tasty tea" href="https://www.chunshuitang.com.tw/drink/pot-of-tea/"/>, and adding new flights on Flighty, new places on Apple Maps, and new eats on Beli. Oh, and did I mention that I love traveling?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}