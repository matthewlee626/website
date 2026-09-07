import { mkdir, copyFile } from "node:fs/promises";

// Keep the separately served workers in sync with the installed MapLibre version.
const destination = new URL("../public/maplibre/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  await copyFile(new URL(`../node_modules/maplibre-gl/dist/${file}`, import.meta.url), new URL(file, destination));
}
