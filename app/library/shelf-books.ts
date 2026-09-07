import allBooks from "./books.generated.json";
import dimensions from "./dimensions";
import editions from "./cover-editions.json";
import type { ShelfBook } from "./prototype/shelf";

export function shuffledShelfBooks(): ShelfBook[] {
  const windows = editions as Record<string, { window?: ShelfBook["window"] }>;
  const books: ShelfBook[] = allBooks
    .filter(book => book.cover && !("hidden" in book && book.hidden) && dimensions[book.slug])
    .map(book => ({ slug: book.slug, title: book.title, author: book.author, cover: book.cover!,
      width: book.width, height: book.height, physical: dimensions[book.slug], window: windows[book.slug]?.window }));
  for (let index = books.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [books[index], books[swap]] = [books[swap], books[index]];
  }
  return books;
}
