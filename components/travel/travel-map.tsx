"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import { type GeoJSONSource, type MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { areaHighlightFeatures } from "./area-highlights";
import { createPlaceIcon, placeIcon } from "./place-icons";
import styles from "./map.module.css";
import type { AtlasConfig, MapSelectionProps } from "./types";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const EMPTY = { type: "FeatureCollection" as const, features: [] };

function containsPoint(ring: number[][], point: [number, number]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x, y] = ring[i];
    const [px, py] = ring[j];
    if ((y > point[1]) !== (py > point[1]) && point[0] < (px - x) * (point[1] - y) / (py - y) + x) inside = !inside;
  }
  return inside;
}

export default function TravelMap({ config, embedded = false, area = "", locationId = "", onPlaceSelect }: MapSelectionProps & { config: AtlasConfig }) {
  const { places } = config;
  const placeCallback = useRef(onPlaceSelect);
  placeCallback.current = onPlaceSelect;
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [place, setPlace] = useState<(typeof places)[number] | null>(null);
  const choosePlace = useRef<(id: string, notify?: boolean) => void>(() => {});
  const [status, setStatus] = useState(`Loading ${config.title}…`);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const clear = useRef<() => void>(() => {});

  useEffect(() => {
    if (!container.current) return;
    const themeTokens = getComputedStyle(container.current);
    const selectionColor = themeTokens.getPropertyValue("--color-map-selection").trim();
    const outlineColor = themeTokens.getPropertyValue("--color-map-outline").trim();
    let instance: maplibregl.Map;
    try {
      // MapLibre 6 resolves its worker relative to import.meta.url. Bundlers
      // relocate that module, so serve the matching worker explicitly.
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      instance = new maplibregl.Map({ container: container.current, style: MAP_STYLE,
        center: config.center, zoom: config.zoom, minZoom: config.minZoom ?? 3, maxZoom: 19,
        maxBounds: config.bounds, attributionControl: false });
    } catch {
      setError("The map could not start. Try a browser with WebGL enabled.");
      return;
    }
    map.current = instance;
    const loadingTimeout = window.setTimeout(() => {
      if (!instance.loaded()) setError("The map is taking too long to load. Check your connection and retry.");
    }, 20000);
    instance.once("idle", () => window.clearTimeout(loadingTimeout));
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    instance.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");
    let buildingLayers: string[] = [];
    const reset = () => {
      (instance.getSource("selection") as GeoJSONSource | undefined)?.setData(EMPTY);
      setSelected(null);
      setPlace(null);
      for (const entry of markers) entry.button.setAttribute("aria-pressed", "false");
    };
    clear.current = reset;
    const markers: { id: string; marker: maplibregl.Marker; button: HTMLButtonElement }[] = [];
    choosePlace.current = (id, notify = true) => {
      reset();
      const destination = places.find(item => item.id === id);
      for (const entry of markers) entry.button.setAttribute("aria-pressed", String(entry.id === id));
      if (!destination) return;
      setPlace(destination);
      if (notify) placeCallback.current?.(destination.id);
      instance.flyTo({ center: destination.coordinates as [number, number], zoom: destination.precision === "area" ? config.areaZoom?.[destination.area] ?? 13 : 15, duration: 700, padding: {left: 0, right: 0, top: 50, bottom: embedded ? 180 : 100} });
    };
    for (const destination of places) {
      const button = document.createElement("button");
      button.className = styles.placeMarker;
      button.appendChild(createPlaceIcon(destination.category));
      button.dataset.category = destination.category || "area";
      button.title = `${destination.name} · ${placeIcon(destination.category).label}` + ("precision" in destination && destination.precision !== "venue" ? " (approximate location)" : "");
      button.setAttribute("aria-label", `Travel note: ${destination.name}`);
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", event => { event.stopPropagation(); choosePlace.current(destination.id); });
      const marker = new maplibregl.Marker({ element: button }).setLngLat(destination.coordinates as [number, number]).addTo(instance);
      markers.push({ id: destination.id, marker, button });
    }
    instance.on("style.load", () => {
      buildingLayers = [];
      const layers = instance.getStyle().layers;
      for (const layer of layers) {
        if (!("source-layer" in layer) || layer["source-layer"] !== "building" || !("source" in layer)) continue;
        if (layer.type === "fill" || layer.type === "fill-extrusion") buildingLayers.push(layer.id);

      }
      if (config.areaHighlights?.length) {
        instance.addSource("area-highlights", { type: "geojson", data: areaHighlightFeatures(config.areaHighlights) });
        const polygonFilter: maplibregl.FilterSpecification = ["==", ["geometry-type"], "Polygon"];
        instance.addLayer({ id: "area-highlight-fill", type: "fill", source: "area-highlights", maxzoom: 14, filter: polygonFilter, paint: { "fill-color": "#33507b", "fill-opacity": 0.035 } });
        instance.addLayer({ id: "area-highlight-halo", type: "line", source: "area-highlights", maxzoom: 14, filter: polygonFilter, paint: { "line-color": "#ffffff", "line-width": 5, "line-opacity": 0.85 } });
        instance.addLayer({ id: "area-highlight-line", type: "line", source: "area-highlights", maxzoom: 14, filter: polygonFilter, paint: { "line-color": "#33507b", "line-width": 2, "line-opacity": 0.85 } });
        instance.addLayer({ id: "area-highlight-label", type: "symbol", source: "area-highlights", maxzoom: 14, filter: ["==", ["geometry-type"], "Point"], layout: { "text-field": ["get", "label"], "text-size": 15, "text-anchor": "bottom", "text-offset": [0, -0.5] }, paint: { "text-color": "#33507b", "text-halo-color": "#ffffff", "text-halo-width": 2 } });
      }
      instance.addSource("selection", { type: "geojson", data: EMPTY });
      instance.addLayer({ id: "selection-fill", type: "fill", source: "selection", paint: { "fill-color": selectionColor, "fill-opacity": 0.75 } });
      instance.addLayer({ id: "selection-outline", type: "line", source: "selection", paint: { "line-color": outlineColor, "line-width": 2 } });
      setReady(true);
    });
    const buildingsAt = (point?: maplibregl.Point): MapGeoJSONFeature[] => {
      if (!instance.isStyleLoaded() || !buildingLayers.length) return [];
      return point ? instance.queryRenderedFeatures(point, { layers: buildingLayers }) : instance.queryRenderedFeatures({ layers: buildingLayers });
    };
    instance.on("mousemove", event => { instance.getCanvas().style.cursor = buildingsAt(event.point).length ? "pointer" : ""; });
    instance.on("click", event => {
      const feature = buildingsAt(event.point)[0];
      reset();
      if (!feature) return;
      // Providers can group many separate buildings into one MultiPolygon.
      // Select the polygon under the pointer, not every building in that group.
      let geometry = feature.geometry;
      if (geometry.type === "MultiPolygon") {
        const point: [number, number] = [event.lngLat.lng, event.lngLat.lat];
        const polygon = geometry.coordinates.find((rings: number[][][]) => containsPoint(rings[0], point) && !rings.slice(1).some(ring => containsPoint(ring, point)));
        if (!polygon) return;
        geometry = { type: "Polygon", coordinates: polygon };
      }
      (instance.getSource("selection") as GeoJSONSource).setData({ type: "Feature", geometry, properties: {} });
      setSelected(feature.properties || {});
    });
    instance.on("idle", () => {
      setStatus(instance.getZoom() < 14 ? "Zoom in to explore individual buildings." : buildingsAt().length ? "Click a building to explore." : "No building footprints here. Try zooming in or moving the map.");
    });
    instance.on("error", () => {
      setError("Some map data could not load. Check your connection and retry.");
    });
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Escape") reset(); };
    window.addEventListener("keydown", keyboard);
    return () => { markers.forEach(entry => entry.marker.remove()); window.clearTimeout(loadingTimeout); window.removeEventListener("keydown", keyboard); instance.remove(); map.current = null; };
  }, [config, embedded, places]);

  useEffect(() => {
    if (!ready || !map.current || !area) return;
    clear.current();
    const matching = places.filter(item => area === "all" ? !config.overviewExcludedAreas?.includes(item.area) : (config.areaGroups?.[area] || [area]).includes(item.area));
    if (!matching.length) return;
    const bounds = new maplibregl.LngLatBounds();
    matching.forEach(item => bounds.extend(item.coordinates as [number, number]));
    map.current.fitBounds(bounds, { padding: 65, maxZoom: config.areaZoom?.[area] ?? 15, duration: 800 });
  }, [area, ready, config, places]);

  useEffect(() => {
    if (ready && locationId) choosePlace.current(locationId, false);
  }, [locationId, ready]);

  function retryMap() {
    if (!map.current) return;
    clear.current();
    setError(""); setReady(false); setStatus("Loading map style…");
    map.current.setStyle(MAP_STYLE);
  }
  const name = selected && (selected["name:en"] || selected.name || selected["name:zh"]);
  const attributes = selected ? Object.entries(selected).filter(([key, value]) => !key.startsWith("name") && value !== null && value !== "" && typeof value !== "object").slice(0, 8) : [];

  return <div className={`${styles.atlas} ${embedded ? styles.embedded : ""}`} data-theme="atlas">
    <div ref={container} className={styles.map} aria-label={`Interactive map of ${config.title}`} />
    <header className={styles.header}>
      <div className={styles.title}><span className={styles.seal} lang={config.language}>{config.seal}</span><div><p><Link href="/thoughts" className={styles.backLink}>← thoughts</Link> / CITY ATLAS</p><h1>{config.title} <span lang={config.language}>{config.localTitle}</span></h1></div></div>
    </header>
    {error && <div className={styles.error} role="alert">{error}<button onClick={retryMap}>Retry</button></div>}
    {embedded && (place || selected) && <aside className={styles.photoSpace} aria-label={`Photo space for ${place?.name || "selected building"}`}><h2 className={styles.photoTitle} aria-live="polite">{place?.name || String(name || "unnamed building")}</h2><div className={styles.photoPlaceholder} /></aside>}
    {!embedded && <aside className={styles.card} aria-label="Building details" aria-live="polite">
      <label className={styles.eyebrow} htmlFor="field-note">FIELD NOTES · {places.length} PLACES</label>
      <select id="field-note" className={styles.placeSelect} value={place?.id || ""} onChange={event => choosePlace.current(event.target.value)}>
        <option value="">Choose a location…</option>
        {Array.from(new Set(places.map(item => item.area))).map(area => <optgroup key={area} label={area}>{places.filter(item => item.area === area).map(item => <option key={item.id} value={item.id}>{item.name} · {placeIcon(item.category).label}</option>)}</optgroup>)}
      </select>
      <h2>{place ? place.name : selected ? String(name || "Unnamed building") : `${config.title}, annotated.`}</h2>
      {place ? <><div className={styles.eyebrow}>{place.area}</div><p className={styles.placeNote}>{place.note}</p><button className={styles.textButton} onClick={() => choosePlace.current("")}>Clear selection ↗</button></> : selected ? <>
        {attributes.length ? <dl>{attributes.map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{String(value)}</dd></div>)}</dl> : <p>No additional details are available for this footprint.</p>}
        <button className={styles.textButton} onClick={() => clear.current()}>Clear selection <span>↗</span></button>
      </> : <p>{ready ? "Choose a map icon for a field note, or zoom in and click a building." : status} Drag to move; scroll or use + / − to zoom.</p>}
      <footer>Notes adapted from <a href={config.sourceUrl} target="_blank" rel="noreferrer">{config.title} travel notes ↗</a>. Pins mark approximate locations, not entrances. Nearby recommendations may refer to different branches.</footer>
    </aside>}
  </div>;
}
