import { execFile } from "node:child_process";
import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const coverDir = path.join(root, "public/library/covers");
const manifestPath = path.join(root, "app/library/books.generated.json");
const matchedEditions = JSON.parse(await readFile(path.join(root, "app/library/cover-editions.json"), "utf8"));
const workspace = await mkdtemp(path.join(os.tmpdir(), "library-covers-"));

const replacements = {
  "15-el-pequen-o-larousse-ilustrado": {
    source: "https://covers.openlibrary.org/b/isbn/9788483327098-L.jpg?default=false",
  },
  "17-the-silmarillion": {
    source: "https://ivmk.net/sii001.jpg",
  },
  "19-artemis": {
    source: "https://images.penguinrandomhouse.com/cover/9780553448122",
  },
  "20-the-left-hand-of-darkness": {
    source: "https://covers.openlibrary.org/b/isbn/9780441478125-L.jpg?default=false",
  },
  "25-where-we-go-from-here": {
    source: "https://covers.openlibrary.org/b/isbn/9781250163264-L.jpg?default=false",
  },
  "36-emotional-design": {
    source: "https://images-na.ssl-images-amazon.com/images/I/71dVma-xToL.jpg",
  },
  "43-klara-and-the-sun": {
    source: "https://images.penguinrandomhouse.com/cover/9780593318171",
  },
  "52-how-to-win-friends-and-influence-people": {
    source:
      "https://cdn11.bigcommerce.com/s-z6agnrtx29/images/stencil/1280x1280/products/655/3289/how-to-win-friends-and-influence-people-front__35769__02302__46937__94537__87110__35342__18900.1736438789.jpg?c=1",
    crop: "561x875+260+103",
  },
  "55-flash-teams": {
    source: "https://images.penguinrandomhouse.com/cover/9780262049849",
  },
  "57-the-art-of-war": {
    source:
      "https://www.scanvik.dk/product-images/9781838575656.jpg?format=jpg&height=590&scale=canvas&width=400",
    crop: "225x354+87+118",
  },
  "74-hybrid-curiosity-in-all-things": {
    source:
      "https://victionary.com/cdn/shop/files/Hybrid_b_top_1000height_1200x1200.png?v=1760086917",
    crop: "625x826+62+165",
  },
  "84-hokusai": {
    source: "https://images.penguinrandomhouse.com/cover/9783791384306",
  },
};

const localCrops = {
  "04-demon-slayer-kimetsu-no-yaiba-vol-1": {
    expected: "720x720",
    crop: "480x720+120+0",
  },
  "32-why-nations-fail": {
    expected: "720x720",
    crop: "466x720+126+0",
  },
  "34-practice-a-book-about-design-craft": {
    expected: "720x900",
    crop: "470x591+124+154",
  },
  "37-the-design-of-everyday-things": {
    expected: "600x600",
    crop: "328x500+136+50",
  },
  "40-chinatown-pretty": {
    expected: "400x400",
    crop: "313x400+44+0",
  },
  "54-the-woke-salaryman-crash-course-on-capitalism": {
    expected: "600x600",
    crop: "326x491+137+55",
  },
  "67-graphic-languages": {
    expected: "600x600",
    crop: "386x534+104+33",
  },
  "69-the-big-score": {
    expected: "720x720",
    crop: "419x519+149+45",
  },
  "71-generative-design-in-branding": {
    expected: "720x720",
    crop: "340x477+190+117",
  },
  "72-digital-design": {
    expected: "720x878",
    crop: "422x653+148+112",
  },
  "83-lucian-bernhard": {
    expected: "720x960",
    crop: "516x602+109+183",
  },
};

async function imageSize(file) {
  const { stdout } = await execFileAsync("magick", [
    "identify",
    "-format",
    "%wx%h",
    file,
  ]);
  return stdout.trim();
}

async function renderCover(input, output, crop) {
  const temporary = path.join(workspace, `${path.basename(output)}.webp`);
  const args = [input, "-auto-orient"];
  if (crop) args.push("-crop", crop, "+repage");
  args.push("-resize", "720x1080>", "-quality", "88", temporary);
  await execFileAsync("magick", args);
  await rename(temporary, output);
}

for (const [slug, recipe] of Object.entries(replacements)) {
  if (matchedEditions[slug]) continue;
  const response = await fetch(recipe.source, {
    headers: { "User-Agent": "matthewlee.xyz library catalog (personal site)" },
  });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const input = path.join(workspace, `${slug}.source`);
  await writeFile(input, Buffer.from(await response.arrayBuffer()));
  await renderCover(input, path.join(coverDir, `${slug}.webp`), recipe.crop);
}

for (const [slug, recipe] of Object.entries(localCrops)) {
  const file = path.join(coverDir, `${slug}.webp`);
  const size = await imageSize(file);
  if (size === recipe.expected) {
    await renderCover(file, file, recipe.crop);
  }
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
for (const book of manifest) {
  if (book.title === "Too Much and Never Enough") book.hidden = true;
  if (!book.cover) continue;
  const file = path.join(root, "public", book.cover.replace(/^\//, ""));
  const [width, height] = (await imageSize(file)).split("x").map(Number);
  book.width = width;
  book.height = height;
  const replacement = replacements[book.slug];
  if (replacement && !matchedEditions[book.slug]) book.source = replacement.source;
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await rm(workspace, { recursive: true, force: true });
