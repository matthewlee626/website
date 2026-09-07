# Design system

The design system formalizes the site's current appearance: a blue canvas, white text and frames, pale blue links, and Nikkei Maru typography. The city atlas has a scoped paper-and-ink theme. These are intentional visual identities.

## Sources of truth

| Layer | File | Responsibility |
| --- | --- | --- |
| Tokens | `styles/tokens.css` | Colors, type, spacing, radii, focus, motion, shadows, content widths and layers |
| Base and component styles | `app/globals.css` | Body theme, keyboard focus, shared component classes and overlay reduced motion |
| Tailwind adapter | `tailwind.config.ts` | Exposes the same tokens as utilities; does not maintain a second palette |
| Components | `components/ui/`, `components/text-link.tsx` | Reusable markup, props and interaction contracts |
| Page CSS modules | Alongside each route | Layout, responsive composition, and specialized illustration/geometry |

## Tokens and usage

Use semantic colors (`--color-canvas`, `--color-text`, `--color-link`, `--color-text-muted`) rather than hex values. CSS modules use `var(...)`; JSX can use `bg-background`, `text-foreground`, `text-link` and `text-muted-foreground`. Overlay colors and focus rings use HSL-channel variables, wrapped with `hsl(...)` by their consumers. Other color tokens are complete CSS colors.

The body font includes the loaded Next.js font and system fallbacks. The Next.js font variable is attached to `html` so root-level font aliases resolve in the same scope. `font-sans`, `font-serif`, and `font-mono` map to the shared font tokens. Body, small, extra-small and page-heading sizes are exposed as `text-base`, `text-sm`, `text-xs` and `text-xl`.

The shared spacing scale is 4, 8, 12, 16, 20, 24, 28, 32, 48 and 72px at the default root size, named `--space-1` through `--space-18` in quarter-rem units. Matching Tailwind spacing utilities read these variables. Tailwind's remaining standard scale is still available. The fluid library gutter and the profile/library maximum widths have their own semantic tokens.

Use `--duration-fast`, `--duration-hover`, `--duration-control`, and `--duration-shelf` with the shared easing tokens. Each animated component must honor `prefers-reduced-motion`; the library, shelf, and overlays do so.

## Components

### Panel

The profile's outlined image, navigation and social frames share `Panel`. It accepts normal div attributes and `className`; `flush` removes the default 16px inset. Layout belongs to the caller.

```tsx
<Panel className="text-center">Navigation</Panel>
<Panel flush><Image src="/pfp.png" alt="stamp of my name" width={200} height={200} /></Panel>
```

### PageHeading

`PageHeading` renders an h1 with the existing 20px / 28px regular heading style. It accepts native heading props and utility overrides. Use one page-level heading per page; editorial atlas headings retain their own hierarchy.

```tsx
<PageHeading>library</PageHeading>
```

### TextLink

`TextLink` accepts Next.js Link props, an optional legacy `text` prop, or rich children. It forwards the anchor ref and all interaction/accessibility props so Radix `asChild` works correctly. Existing new-tab behavior is retained; internal navigation can explicitly select the current tab. New-tab links default to `noopener noreferrer`.

```tsx
<TextLink href="/blogs" target="_self">Blogs.</TextLink>
<TextLink href="https://example.com" text="An external reference" />
```

Icon-only social links continue using Next.js Link with a visually hidden accessible label. Global focus styling applies to links, buttons, and inputs. Page-specific focus offsets may accommodate illustrated content.

### HoverCard and Popover

The Radix wrappers share `overlayClassName` and `.ds-overlay` for border, surface, radius, shadow, layer and entry/exit motion. The wrappers retain their sizing and padding: hover cards are 16rem wide with a 4px inset; popovers are 18rem wide with a 16px inset. Positioning and interaction remain Radix responsibilities. The existing `HoverCardSmallImage` composes a link, image, and caption from these primitives.

## Atlas theme

`data-theme="atlas"` on the atlas root scopes paper, ink, accent, rule, error, shadow and font tokens to its subtree. Its map selection colors are also tokens: MapLibre reads their resolved CSS values when initializing because canvas paint cannot directly consume CSS variables. Changing them requires remounting/reloading the map. The atlas module owns its title plate, segmented control, building details card and responsive placement.

## Boundaries and extension

- Reuse an existing semantic token before introducing another value. Promote a value when it represents a shared design decision, rather than naming every measured pixel.
- Keep book dimensions, crop windows, perspective, rotation, paper textures and other illustration geometry local to the library. These are content/illustration data, not global UI primitives.
- Keep route-specific layout breakpoints in their CSS modules. CSS custom properties cannot be used directly in media-query conditions; the existing 600px library, 700px shelf, 640px atlas and Tailwind 768px profile breakpoints remain intentional.
- Add components for repeated visual or interaction contracts. A unique atlas card or book scene does not need a generic abstraction simply to move it to another folder.
- The unused starter dark theme, chart colors, destructive palette and missing Didone font reference have been removed. A future theme should supply values for the actual components and be checked across all routes.

## Verification

Run `pnpm exec eslint app components tailwind.config.ts`, `pnpm exec tsc --noEmit`, and `pnpm build`. Check the home page, library, shelf prototype, blog index and atlas at desktop and narrow widths. Check keyboard focus, shelf selection/range controls, and reduced motion when changing interaction tokens. External map tiles still require network/provider availability.
