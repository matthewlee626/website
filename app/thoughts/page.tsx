import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { posts } from "@/app/blogs/posts";

export const metadata: Metadata = {
  title: "thoughts · Matthew Lee",
  description: "Notes on places, books, and other things.",
};

export default function ThoughtsPage() {
  return (
    <PageLayout className="mx-auto min-h-[calc(100dvh-64px)] max-w-3xl px-8 py-12 font-sans lowercase md:py-16">
      <h1 className="mb-6 text-2xl font-normal">thoughts</h1>
      <ul className="list-disc space-y-5 pl-5">
        {posts.map((post) => (
          <li key={post.slug} className="pl-1 text-lg">
            <Link href={`/blogs/${post.slug}`} className="underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              {post.title.toLowerCase()}
            </Link>
            {post.writtenOn && <p className="mt-1 text-sm text-white/65">
              <time dateTime={post.writtenOn}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${post.writtenOn}T00:00:00Z`))}</time>
            </p>}
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
