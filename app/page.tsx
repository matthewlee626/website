import Image from "next/image";
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import Link from "next/link";


export default function Home() {
  return (
    <div className={`flex flex-cols justify-center items-center w-full p-8 md:h-screen font-sans`}>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-12 md:max-w-3xl md:place-items-center p-12 md:p-4">
        <div className="col-span-1 flex flex-col gap-4 justify-center h-full">
          <div className="flex flex-col items-center text-center border-4 border-dashed border-white rounded-lg p-4 gap-4">
            <Image
              src="/pfp.png"
              alt="A picture of me. Taken in Hakone."
              width={200}
              height={200}
              priority={true}
            />
            <p>📍 Hakone, Kantō</p>
          </div>
          <div className="border-4 border-solid border-white rounded-lg p-4 text-center">
            <ul>
              <li>Travels.</li>
              <li>Scrapbook.</li>
              <li>Advice.</li>
              <li>Projects.</li>
            </ul>
          </div>
          <div className="border-4 border-solid border-white rounded-lg p-4 flex flex-row justify-center gap-8">
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
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">
              How&apos;s it going? While you&apos;re here...
            </h1>
            <p>
              I&apos;m a software engineer, travel addict, and social-put-together-er based in the lovely city of Stanford, CA. I&apos;m currently completing my MS in Computer Science at Stanford University and graduated with a BA in Computer Science + Data Science at UC Berkeley. Before that, I grew up in the sunny SoCal suburbs of the San Gabriel Valley and even before that, was born in beautiful Beijing.
            </p>
            <p>
              Right now, I&apos;m interning on Vercel&apos;s v0 team, building the best prompt-to-website developer platform in the game. I previously engineered tools for automated creator growth at Patreon, explored the future of prototyping at Figma, and made infrastructure better at Uber.
            </p>
            <p>
              My academic research explores the potentials and limitations of machine learning technologies in influencing human cognition. Currently, I&apos;m investigating the impact of algorithmic social media on political polarization. My previous work includes developing LLM-enabled tools for writing with speech and analyzing case studies on the prompt design process.
            </p>
            <p>
              I&apos;m particularly fond of Cal Hacks, Berkeley&apos;s best hackathon organizing club, for all that it gave me when I was a director. In my free time, I love stargazing with my trusty AWB OneSky reflector telescope and collecting tasty teas — currently a fan of the 春水堂高山金萱乌龙茶. Oh, and did I mention that I love traveling?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}