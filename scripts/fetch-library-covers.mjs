import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const source = JSON.parse(await readFile(path.join(root, "scripts/library-books.json"), "utf8"));
const overrides = JSON.parse(await readFile(path.join(root, "scripts/library-cover-overrides.json"), "utf8"));
const outputDir = path.join(root, "public/library/covers");
const manifestPath = path.join(root, "app/library/books.generated.json");
await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });
let existing = [];
try {
  existing = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {}

const headers = { "User-Agent": "matthewlee.xyz library catalog (personal site)" };
const clean = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const slugify = (value) => clean(value).replace(/\s+/g, "-");

function score(candidate, book) {
  const title = clean(candidate.volumeInfo?.title || candidate.title || "");
  const wanted = clean(book.title);
  const titleWords = new Set(wanted.split(" "));
  const overlap = title.split(" ").filter((word) => titleWords.has(word)).length / Math.max(1, titleWords.size);
  const authors = clean((candidate.volumeInfo?.authors || candidate.author_name || []).join(" "));
  const wantedAuthor = clean(book.author).split(" ").filter((word) => word.length > 3);
  const authorOverlap = wantedAuthor.filter((word) => authors.includes(word)).length / Math.max(1, wantedAuthor.length);
  return overlap * 0.78 + authorOverlap * 0.22 + (title === wanted ? 0.4 : 0);
}

async function googleCandidate(book) {
  const queries = [
    book.isbn ? `isbn:${book.isbn}` : `intitle:${book.title} inauthor:${book.author}`,
    `"${book.title}" ${book.author}`,
    `intitle:${book.title}`,
  ];
  const candidates = [];
  let sourceUrl = "";
  for (const q of queries) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20&printType=books`;
    sourceUrl = url;
    const response = await fetch(url, { headers });
    if (!response.ok) continue;
    const data = await response.json();
    candidates.push(...(data.items || []).filter((item) => item.volumeInfo?.imageLinks?.thumbnail));
    if (candidates.length) break;
  }
  candidates.sort((a, b) => score(b, book) - score(a, book));
  const best = candidates[0];
  if (!best || score(best, book) < 0.4) return null;
  const image = best.volumeInfo.imageLinks.thumbnail
    .replace(/^http:/, "https:")
    .replace(/zoom=1/, "zoom=2");
  return { image, source: best.volumeInfo.infoLink || sourceUrl };
}

async function openLibraryCandidate(book) {
  if (book.isbn) {
    return {
      image: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`,
      source: `https://openlibrary.org/isbn/${book.isbn}`,
    };
  }
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&limit=10`;
  const response = await fetch(url, { headers });
  if (!response.ok) return null;
  const data = await response.json();
  const candidates = (data.docs || []).filter((item) => item.cover_i);
  candidates.sort((a, b) => score(b, book) - score(a, book));
  const best = candidates[0];
  if (!best || score(best, book) < 0.5) return null;
  return {
    image: `https://covers.openlibrary.org/b/id/${best.cover_i}-L.jpg?default=false`,
    source: best.key ? `https://openlibrary.org${best.key}` : url,
  };
}

async function download(candidate, destination) {
  const response = await fetch(candidate.image, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error("cover response was too small");
  await writeFile(destination, bytes);
}

async function dimensions(file) {
  const { stdout } = await execFileAsync("magick", ["identify", "-format", "%w %h", file]);
  const [width, height] = stdout.trim().split(/\s+/).map(Number);
  return { width, height };
}

async function processBook(book, index) {
  const slug = `${String(index + 1).padStart(2, "0")}-${slugify(book.title)}`;
  const previous = existing.find((item) => item.slug === slug && item.cover);
  if (previous) {
    console.log(`KEEP ${book.title}`);
    return previous;
  }
  const rawPath = path.join(outputDir, `${slug}.source`);
  const imagePath = path.join(outputDir, `${slug}.webp`);
  const override = overrides[book.title];
  const candidates = [
    override ? { image: override, source: override } : null,
    await googleCandidate(book),
    await openLibraryCandidate(book),
  ].filter(Boolean);
  let chosen = null;
  for (const candidate of candidates) {
    try {
      await download(candidate, rawPath);
      chosen = candidate;
      break;
    } catch (error) {
      console.warn(`  candidate failed: ${error.message}`);
    }
  }
  if (!chosen) {
    console.warn(`MISS ${book.title}`);
    return { ...book, slug, cover: null, width: 0, height: 0, source: null };
  }
  await execFileAsync("magick", [rawPath, "-auto-orient", "-resize", "720x1080>", "-quality", "88", imagePath]);
  const { width, height } = await dimensions(imagePath);
  console.log(`OK   ${book.title} (${width}×${height})`);
  return {
    ...book,
    slug,
    cover: `/library/covers/${slug}.webp`,
    width,
    height,
    source: chosen.source,
  };
}

const results = [];
for (let index = 0; index < source.length; index += 1) {
  results.push(await processBook(source[index], index));
  await new Promise((resolve) => setTimeout(resolve, 80));
}

await writeFile(manifestPath, `${JSON.stringify(results, null, 2)}\n`);
console.log(`Wrote ${manifestPath}`);
