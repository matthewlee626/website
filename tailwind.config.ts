import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-editorial)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        background: "var(--color-canvas)",
        foreground: "var(--color-text)",
        link: "var(--color-link)",
        muted: { foreground: "var(--color-text-muted)" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
      spacing: Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 12, 18].map(n => [n, `var(--space-${n})`])),
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },
      maxWidth: { "3xl": "var(--content-profile)" },
      fontSize: {
        xs: "var(--text-xs)", sm: "var(--text-sm)", base: "var(--text-body)",
        xl: ["var(--text-heading)", "var(--leading-heading)"],
      },
    },
  },
  plugins: [animate],
};
export default config;
