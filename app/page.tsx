import Image from "next/image";
import Link from "next/link";
import { LinkedInLogoIcon, TwitterLogoIcon, GitHubLogoIcon} from "@radix-ui/react-icons"
import { TextLink } from "@/components/text-link";


export default function Home() {
  return (
    <div className={`flex flex-cols justify-center items-center w-full p-8 md:h-screen font-sans`}>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-12 md:max-w-3xl p-12 md:p-4">
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
            I&apos;m a software engineer at Figma in the curious city of San Francisco, CA, working on bringing design and code ever closer together.
            <strong>I received my:</strong>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                MS in Computer Science at <TextLink text="Stanford University" href="https://www.stanford.edu"/>
              </li>
              <li>
                BA in Computer Science + Data Science at <TextLink text="UC Berkeley" href="https://www.berkeley.edu"/>
              </li>
              <li>
                formative beginnings in the San Gabriel Valley suburbs of LA
              </li>
            </ul>
            <strong>In my free time, I love:</strong>
            <ul className="list-disc pl-5 space-y-2">
              <li>stargazing in the wild</li>
              <li>brewing tasty tea leaves and coffee beans for friends</li>
              <li>running to new photo spots around the Bay Area</li>
              <li>exploring the Bay Area with my dog, <TextLink text="Momo" href="https://www.instagram.com/momo_the_doggo/"/></li>
            </ul>
            <strong>Previously, I&apos;ve side quested:</strong>
            <ul className="list-disc pl-5 space-y-2">
              <li>teaching CS to high schoolers in Ethiopia with <TextLink text="AddisCoder" href="https://www.addiscoder.com/"/></li>
              <li>interviewing with the SF Chronicle about my <TextLink text="food influencing" href="https://www.sfchronicle.com/food/article/beli-restaurants-bay-area-app-20772802.php"/> </li>
              <li>directing Berkeley&apos;s flagship hackathon, <TextLink text="Cal Hacks" href="https://hackberkeley.org"/></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}