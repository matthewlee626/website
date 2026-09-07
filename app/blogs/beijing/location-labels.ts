import names from "./location-labels.json";

const translations: Record<string, string> = names;
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(`(?<![a-z])(?:${Object.keys(names).sort((a, b) => b.length - a.length).map(escape).join("|")})(?![a-z])`, "gi");

// Annotate display text only; URLs, section anchors and map IDs stay stable.
export function withChinese(text: string): string {
  return text.replace(pattern, (name, offset: number) => {
    const following = text.slice(offset + name.length);
    if (/^\s*[（(][\p{Script=Han}]/u.test(following)) return name;
    return `${name} (${translations[name.toLowerCase()]})`;
  });
}
