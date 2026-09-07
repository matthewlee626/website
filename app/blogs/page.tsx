import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blogs · Matthew Lee",
  description: "Notes and experiments by Matthew Lee.",
};

export default function BlogsPage() {
  return (
    <PageLayout className="mx-auto min-h-screen max-w-3xl px-8 py-12 font-sans md:py-24" breadcrumbs={[{ label: "home", href: "/" }, { label: "blogs" }]}>
      <h1 className="mb-12 mt-12 text-4xl">blogs.</h1>
      <ul className="divide-y divide-white/30 border-y border-white/30">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blogs/${post.slug}`} className="group block py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              <div className="flex items-center justify-between gap-6">
                <h2 className="text-2xl group-hover:underline underline-offset-4">{post.title}</h2>
                <span aria-hidden="true">↗</span>
              </div>
              <p className="mt-3 text-base leading-relaxed">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
