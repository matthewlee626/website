# Travel blogs

Beijing and Japan use `components/travel/`:

- `travel-reader.tsx`: responsive split layout, sticky map, reading-area tracking, and bidirectional place selection. Notes use `data-map-area`, `data-map-location`, and `data-inline-location` to connect to the map.
- `travel-map.tsx`: MapLibre lifecycle, markers, area framing, building selection, error handling, and standalone/embedded views.
- `rich-text.tsx`: safe React rendering of emphasis, underlines, links, and optional place aliases. Destination-specific display transforms are injected (Beijing uses `withChinese`).
- `travel-article.tsx`: section headings, paragraphs, nested bullet lists, and local images from typed article data.
- `types.ts`: destination configuration, place, article, and selection contracts. All map coordinates must already be WGS84.
- `reader.module.css` and `map.module.css`: the single source of shared travel styling.

To add a destination, provide a stable, module-level `AtlasConfig`, article data and a small reader adapter, create its page under `app/blogs/<slug>/`, then register it in `app/blogs/posts.ts`. `areaGroups` combine multiple neighborhoods into a city view; `areaZoom` controls city and region framing. Place IDs must be unique and must match the article's aliases/attributes.

Beijing keeps its original article format and bullet-to-pin mappings in its adapter. Its map config performs the existing Chinese coordinate conversion and display-name annotation before passing data to the shared map. `/blogs/beijing/map` still uses the standalone shared map through a thin wrapper.

Japan's article was imported from the requested Notion page, including all 19 sections, nested lists, original links, priority underlines, four inline images, and cover photograph. The source wording (including dated prices, personal opinions, and the repeated shopping list) is preserved. Images are local assets, rendered with Next Image so expiring Notion URLs aren't needed at runtime. Place coordinates come from OpenStreetMap through Photon; each place records its source URL. City/neighborhood pins represent an area, and landmark pins are approximate locations rather than entrances. Restaurants without a verified pin remain ordinary notes or their original website links.

Validation: `npx tsc --noEmit`, `npx eslint components/travel app/blogs/japan app/blogs/beijing/beijing-reader.tsx app/blogs/beijing/beijing-map.tsx app/blogs/beijing/map-config.ts`, `node --experimental-strip-types --test scripts/test-beijing-coordinates.mjs`, `node --test scripts/test-travel-rich-text.cjs`, and `npm run build`.

## Japan refinements

The redundant Tokyo overview image and visible source footer are removed. Six approximate neighborhood circles replace the image's annotations on the interactive map; `areaHighlights` is an optional destination configuration, with geographic polygon generation in `area-highlights.ts`. Circles and labels disappear above zoom 14 for venue browsing. Store pins now include official locations for First Arrows, Gentle Monster Aoyama, and Theused, plus additional OSM-verified shops and restaurants. External venue links retain their website link and gain an adjacent map button.

## Pin icons

Both maps render category icons from `components/travel/place-icons.ts` instead of numbers. Each place has an explicit `category` in its destination JSON; nearby restaurant mentions do not change the category of a historic site. Supported categories include food, coffee/tea, bar, history/museum, shopping, park, art, hotel, university, entertainment, landmark, hot springs, aquarium, and city/neighborhood. Icons inherit marker colors and retain the place name as the accessible label and hover tooltip. IDs remain stable for note-to-map navigation.
