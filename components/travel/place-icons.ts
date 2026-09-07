// Shared line icons use currentColor, including the selected marker state.
const icons = {
  food: { label: "Food", paths: ["M4 3v5a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 3-3 6-3 9h5V3h-2ZM19 12v9"] },
  coffee: { label: "Coffee / tea", paths: ["M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h2a3 3 0 0 1 0 6h-2M3 21h16M7 3v2M11 2v3M15 3v2"] },
  bar: { label: "Bar", paths: ["M7 3h10l1 6a6 6 0 0 1-12 0l1-6ZM6 9h12M12 15v6M8 21h8"] },
  history: { label: "History / museum", paths: ["M3 8l9-5 9 5H3ZM5 10v8M10 10v8M14 10v8M19 10v8M3 21h18M4 18h16"] },
  shopping: { label: "Shopping", paths: ["M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2"] },
  park: { label: "Park / nature", paths: ["M12 2l6 7h-3l5 7H4l5-7H6l6-7ZM12 16v5M8 21h8"] },
  art: { label: "Art / gallery", paths: ["M21 12a9 9 0 1 0-9 9h1a2 2 0 0 0 1-4 2 2 0 0 1 1-4h4a2 2 0 0 0 2-1ZM7 8h.01M12 6h.01M17 8h.01M6 13h.01"] },
  hotel: { label: "Hotel", paths: ["M3 4v17M21 10v11M3 17h18M3 9h5v8M8 10h10a3 3 0 0 1 3 3v4"] },
  university: { label: "University", paths: ["M2 9l10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v8"] },
  entertainment: { label: "Entertainment", paths: ["M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5ZM14 5v3M14 11v2M14 16v3"] },
  landmark: { label: "Landmark / architecture", paths: ["M5 21V8l8-5v18M13 9h6v12M3 21h18M8 10v1M8 14v1M8 18v1M16 12v1M16 16v1"] },
  spa: { label: "Hot springs", paths: ["M4 15c0 8 16 8 16 0M3 15h18M7 11c-3-3 3-4 0-7M12 11c-3-3 3-4 0-7M17 11c-3-3 3-4 0-7"] },
  aquarium: { label: "Aquarium", paths: ["M17 12l5-5v10l-5-5ZM17 12c-5-8-12-6-15 0 3 6 10 8 15 0ZM6 11h.01"] },
  area: { label: "City / neighborhood", paths: ["M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16M15 5v16"] },
};
export type PlaceCategory = keyof typeof icons;
export function placeIcon(category?: string) {
  return icons[category && Object.hasOwn(icons, category) ? category as PlaceCategory : "area"];
}
export function createPlaceIcon(category?: string): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  for (const [key, value] of Object.entries({ viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" })) svg.setAttribute(key, value);
  for (const d of placeIcon(category).paths) {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  }
  return svg;
}
