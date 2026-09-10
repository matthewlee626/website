import { PageHeading } from "@/components/ui/page-heading";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import allBooks from "./books.generated.json";
import physicalDimensions from "./dimensions";
import coverEditions from "./cover-editions.json";
import styles from "./library.module.css";

const pageTitle = "library — matthew lee";
const pageDescription = "A visual index of books from Matthew Lee's shelves.";
const canonicalUrl = "https://matthewlee.xyz/thoughts/library";
const socialImageUrl = "https://matthewlee.xyz/og.png";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    type: "website",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Matthew Lee Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [socialImageUrl],
  },
};

export const dynamic = "force-dynamic";

type Book = (typeof allBooks)[number];
type PhysicalDimensions = { widthMm: number; heightMm: number };
type CoverWindow = { x: number; y: number; width: number; height: number };
const editionsBySlug: Record<string, { imageSource: string; window?: CoverWindow }> = coverEditions;

function coverStyle(book: Book): CSSProperties | undefined {
  const window = editionsBySlug[book.slug]?.window;
  if (!window) return undefined;
  return {
    position: "absolute",
    maxWidth: "none",
    objectFit: "fill",
    width: `${(book.width / window.width) * 100}%`,
    height: `${(book.height / window.height) * 100}%`,
    left: `${(-window.x / window.width) * 100}%`,
    top: `${(-window.y / window.height) * 100}%`,
  };
}

const dimensionsBySlug = physicalDimensions as Record<
  string,
  PhysicalDimensions
>;

const books = allBooks
  .filter(
    (book): book is Book & { cover: string } =>
      typeof book.cover === "string" && !("hidden" in book && book.hidden),
  )
  .map((book) => ({
    ...book,
    physical: dimensionsBySlug[book.slug],
  }))
  .filter(
    (book): book is typeof book & { physical: PhysicalDimensions } =>
      Boolean(book.physical),
  );

const widestBookMm = Math.max(
  ...books.map((book) => book.physical.widthMm),
);

export default function LibraryGrid() {
  const shuffledBooks = [...books];

  for (let index = shuffledBooks.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledBooks[index], shuffledBooks[swapIndex]] = [
      shuffledBooks[swapIndex],
      shuffledBooks[index],
    ];
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <PageHeading>library</PageHeading>
      </header>

      <section className={styles.grid} aria-label="Books in Matthew Lee's library">
        {shuffledBooks.map((book, index) => (
          <figure
            className={styles.book}
            key={book.slug}
            style={
              {
                "--physical-width-ratio":
                  book.physical.widthMm / widestBookMm,
                "--physical-aspect-ratio": `${book.physical.widthMm} / ${book.physical.heightMm}`,
              } as CSSProperties
            }
          >
            <div className={styles.coverWrap}>
              <div className={styles.coverFrame}>
              <Image
                className={styles.cover}
                style={coverStyle(book)}
                src={book.cover}
                alt={`Cover of ${book.title} by ${book.author}`}
                width={book.width}
                height={book.height}
                sizes="(max-width: 520px) 44vw, (max-width: 900px) 28vw, 160px"
                priority={index < 12}
                unoptimized
              />
              </div>
            </div>
            <figcaption>
              <span className={styles.title}>{book.title}</span>
              <span className={styles.details}>{book.author}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
