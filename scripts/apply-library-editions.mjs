import { execFile } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const editions = JSON.parse(await readFile("app/library/cover-editions.json", "utf8"));
const manifestPath = "app/library/books.generated.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const staging = await mkdtemp(path.join(tmpdir(), "library-matched-editions-"));
const updates = await Promise.all(Object.entries(editions).map(async ([slug, edition]) => {
  const book = manifest.find((entry) => entry.slug === slug);
  if (!book) throw new Error(`Unknown book: ${slug}`);
  const input = path.join(staging, `${slug}.source`);
  await exec("curl", ["-sfL", "--max-time", "40", edition.imageSource, "-o", input]);
  // Retain original pixels and the original cover artwork; framing is handled in CSS.
  const cover = `/library/covers/${slug}-matched.webp`;
  await exec("magick", [input, "-quality", "92", path.join(root, "public", cover)]);
  const { stdout } = await exec("magick", ["identify", "-format", "%w %h", input]);
  const [width, height] = stdout.trim().split(/\s+/).map(Number);
  if (width < 100 || height < 100) throw new Error(`Invalid cover: ${slug}`);
  if (edition.window && (edition.window.x + edition.window.width > width || edition.window.y + edition.window.height > height)) {
    throw new Error(`Cover window exceeds image: ${slug}`);
  }
  return { book, cover, width, height, edition };
}));
for (const { book, cover, width, height, edition } of updates) {
  Object.assign(book, { cover, width, height, source: edition.source, edition: edition.edition });
  if (edition.isbn) book.isbn = edition.isbn;
  console.log(`${book.title}: ${width} × ${height}`);
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
