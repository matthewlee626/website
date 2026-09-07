import Shelf from "@/app/library/prototype/shelf";
import { shuffledShelfBooks } from "@/app/library/shelf-books";

export { metadata } from "@/app/library/grid";
export const dynamic = "force-dynamic";

export default function LibraryPage() {
  return <Shelf books={shuffledShelfBooks()} />;
}
