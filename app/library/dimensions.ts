import frontEstimates from "./physical-dimensions.json";
import spineEstimates from "./prototype/spine-estimates.json";
import catalogue from "./catalogue-dimensions.json";

export type BookDimensions = {
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  status: string;
  thicknessStatus: "catalogue-listed" | "photo-estimate";
  sources: string[];
  note: string;
  isbn?: string;
};

type CatalogueDimensions = Partial<Pick<BookDimensions, "widthMm" | "heightMm" | "thicknessMm" | "isbn">>
  & Pick<BookDimensions, "status" | "sources" | "note">;

const overrides = catalogue as Record<string, CatalogueDimensions>;
const depths: Record<string, number> = Object.assign({}, ...Object.values(spineEstimates.photos));

// Both views use this resolver. The original photo-derived inputs remain intact
// so uncertain values can be traced and recalibrated without overwriting evidence.
const dimensions: Record<string, BookDimensions> = Object.fromEntries(
  Object.entries(frontEstimates).map(([slug, estimate]) => {
    const record = overrides[slug];
    const heightMm = record?.heightMm ?? estimate.heightMm;
    const rawDepth = depths[slug];
    if (!Number.isFinite(rawDepth) || rawDepth <= 0) {
      throw new Error(`Missing physical depth for ${slug}`);
    }
    return [slug, {
      widthMm: record?.widthMm ?? estimate.widthMm,
      heightMm,
      // The visual depth/height ratio from the original photo stays unchanged
      // when a reliable height becomes available but depth is still uncertain.
      thicknessMm: record?.thicknessMm ?? Math.round(rawDepth * heightMm / estimate.heightMm * 10) / 10,
      status: record?.status ?? "photo-estimate",
      thicknessStatus: record?.thicknessMm === undefined ? "photo-estimate" : "catalogue-listed",
      sources: record?.sources ?? [],
      note: record?.note ?? "No securely matched three-dimensional catalogue record; retain original photo-based estimates.",
      ...(record?.isbn ? { isbn: record.isbn } : {}),
    } satisfies BookDimensions];
  }),
);

export default dimensions;
