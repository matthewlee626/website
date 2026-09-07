import Shelf from "./prototype/shelf";
import { shuffledShelfBooks } from "./shelf-books";
export { metadata } from "./grid";
export const dynamic = "force-dynamic";
export default function LibraryPage() { return <Shelf books={shuffledShelfBooks()} />; }
