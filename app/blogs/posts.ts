// Keep posts newest first.
// Add each post here and create its page at app/blogs/<slug>/page.tsx.
type ThoughtPost = { slug: string; title: string; description: string; writtenOn?: string };

export const posts: ThoughtPost[] = [
  {
    slug: "beijing",
    title: "Beijing field notes",
    description: "A city of concentric rings, hutongs, imperial history, and very good lamb.",
  },
  {
    slug: "library",
    title: "library",
    description: "A bookshelf to browse.",
  },
  {
    slug: "japan",
    title: "Japan field notes",
    description: "Tokyo neighborhoods, Kansai day trips, and notes on food, shopping, and shrines.",
  },
];
