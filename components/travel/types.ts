export type Place = { id: string; name: string; area: string; coordinates: number[]; note: string; precision?: string; category?: string; aliases?: string[] };
export type AreaHighlight = { label: string; center: [number, number]; radiusKm: number };
export type AtlasConfig = {
  title: string; localTitle: string; language: string; seal: string; sourceUrl: string;
  center: [number, number]; zoom: number; minZoom?: number;
  bounds?: [[number, number], [number, number]]; overviewExcludedAreas?: string[];
  areaGroups?: Record<string, string[]>; areaZoom?: Record<string, number>;
  areaHighlights?: AreaHighlight[];
  places: Place[];
};
export type MapSelectionProps = { embedded?: boolean; area?: string; locationId?: string; onPlaceSelect?: (id: string) => void };
export type TravelBlock = { type: 'paragraph' | 'bullet' | 'heading' | 'image'; text: string; level?: number; alt?: string; width?: number; height?: number; children?: TravelBlock[] };
export type TravelSection = { id: string; title: string; level: number; area?: string; locationId?: string; blocks: TravelBlock[] };
