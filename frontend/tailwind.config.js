/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0058be",
        "primary-container": "#2170e4",
        "on-primary": "#ffffff",
        secondary: "#00687a",
        "secondary-container": "#57dffe",
        tertiary: "#924700",
        background: "#faf8ff",
        surface: "#faf8ff",
        "on-surface": "#131b2e",
        "on-surface-variant": "#424754",
        "text-muted": "#64748B",
        "border-subtle": "#E2E8F0",
        "outline-variant": "#c2c6d6",
        "aqi-good": "#22C55E",
        "aqi-moderate": "#EAB308",
        "aqi-unhealthy-sensitive": "#F97316",
        "aqi-unhealthy": "#EF4444",
        "aqi-hazardous": "#A855F7",
        "error-container": "#ffdad6",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "40px",
        "stack-gap-md": "24px",
        "stack-gap-sm": "12px",
      },
    },
  },
  plugins: [],
};
