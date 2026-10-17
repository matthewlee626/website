# README 

Uhh, I made my website? It uses Next.js and Tailwind. There's not too much of a template to take but if you're digging around here I assume you're getting some value from this repo!

The [design system](docs/design-system.md) documents shared tokens, components, themes, and extension conventions. Start with `styles/tokens.css` for visual changes.

## Development and verification

Use Node.js 24 (`nvm use`) and pnpm 12.14.0. `package.json` pins the Node major
for Vercel as well; the former Node 20 deployment setting is discontinued.

```sh
npm install --global pnpm@12.14.0
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
pnpm typecheck
pnpm exec playwright install chromium
pnpm test:e2e
```

The browser suite uses a production server on port 3100. It checks navigation,
permanent redirects, bookshelf buttons/keyboard/touch, and article-to-map
selection with the real MapLibre worker. It substitutes only the remote basemap
and glyph responses so those checks do not depend on a tile provider.

The committed visual baselines were captured **before** the dependency upgrade
on macOS with Chrome at 390px and 1280px. Run
`PLAYWRIGHT_CHANNEL=chrome pnpm test:visual` on the same platform to compare the
homepage and thoughts layouts. Screenshots are opt-in because font rasterization
differs between operating systems; CI runs the portable behavior checks.

TypeScript 7 powers `pnpm typecheck`. The `typescript` alias supplies Microsoft's
TypeScript 6 compatibility API for ESLint and Next's API-based tooling. Tests load
TypeScript/TSX modules with `tsx`, without compiler API shims. See Microsoft's
[side-by-side migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

Known upstream limitations after the October 2026 refresh: three ESLint plugins
bundled by `eslint-config-next` still declare ESLint 9 peer ranges, although this
site's lint passes with ESLint 10.13.0. `pnpm audit` also reports one unpatched
`braces` advisory through Next's development-only lint plugin; production
dependencies have no reported advisories. Do not suppress those checks.
