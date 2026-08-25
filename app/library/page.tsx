import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import allBooks from "./books.generated.json";
import styles from "./library.module.css";

const pageTitle = "Library — Matthew Lee";
const pageDescription = "A visual index of books from Matthew Lee's shelves.";
const canonicalUrl = "https://matthewlee.xyz/library";
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

type Book = (typeof allBooks)[number];

const books = allBooks.filter(
  (book): book is Book & { cover: string } => typeof book.cover === "string",
);

export default function LibraryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Matthew Lee</p>
          <h1>Library</h1>
        </div>
        <div className={styles.headerMeta}>
          <span>{books.length} books</span>
          <Link href="/">Back home</Link>
        </div>
      </header>

      <section className={styles.grid} aria-label="Books in Matthew Lee's library">
        {books.map((book, index) => (
          <figure className={styles.book} key={book.slug}>
            <div className={styles.coverWrap}>
              <Image
                className={styles.cover}
                src={book.cover}
                alt={`Cover of ${book.title} by ${book.author}`}
                width={book.width}
                height={book.height}
                sizes="(max-width: 520px) 44vw, (max-width: 900px) 28vw, 160px"
                priority={index < 12}
              />
            </div>
            <figcaption>
              <span className={styles.title}>{book.title}</span>
              <span className={styles.details}>
                {book.author} · {book.width} × {book.height} px
              </span>
            </figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
