// Keep posts newest first.
// Add each post here and create its page at app/thoughts/<slug>/page.tsx.
type ThoughtPost = { slug: string; title: string; description: string; writtenOn?: string };

export const posts: ThoughtPost[] = [
  {
    slug: "beijing",
    writtenOn: "2026-08-29",
    title: "Beijing travel notes",
    description: "A city of concentric rings, hutongs, imperial history, and very good lamb.",
  },
  {
    slug: "library",
    writtenOn: "2026-08-26",
    title: "library",
    description: "A bookshelf to browse.",
  },
  {
    slug: "japan",
    writtenOn: "2026-02-21",
    title: "Japan travel notes",
    description: "Tokyo neighborhoods, Kansai day trips, and notes on food, shopping, and shrines.",
  },
];
