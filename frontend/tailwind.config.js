import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Lumina Campus Color Palette - Matches Stitch Design System
        primary: {
          DEFAULT: "#6366F1", // Indigo
          50: "#E0E7FF",
          100: "#C7D2FE",
          200: "#A5B4FC",
          300: "#818CF8",
          400: "#6366F1",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          800: "#312E81",
          900: "#1E1B4B",
        },
        primaryContainer: {
          DEFAULT: "#8B5CF6", // Violet
          50: "#EDE9FE",
          100: "#DDD6FE",
          200: "#C4B5FD",
          300: "#A78BFA",
          400: "#8B5CF6",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#2E1065",
        },
        secondary: {
          DEFAULT: "#EC4899", // Pink
          50: "#FCE7F3",
          100: "#FBCFE8",
          200: "#F9A8D4",
          300: "#F472B6",
          400: "#EC4899",
          500: "#DB2777",
          600: "#BE185D",
          700: "#9D174D",
          800: "#831843",
          900: "#500724",
        },
        tertiary: {
          DEFAULT: "#22D3EE", // Cyan
          50: "#CFFAFE",
          100: "#A5F3FC",
          200: "#67E8F9",
          300: "#22D3EE",
          400: "#06B6D4",
          500: "#0891B2",
          600: "#0E7490",
          700: "#155E75",
          800: "#164E63",
          900: "#083344",
        },
        tertiaryContainer: {
          DEFAULT: "#67E8F9", // Cyan Light
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        surface: {
          DEFAULT: "var(--bg-surface)",
          dim: "var(--bg-surface-dim)",
          bright: "var(--bg-surface-bright)",
          container: "var(--bg-surface-container)",
          containerHigh: "var(--bg-surface-container-high)",
          containerHighest: "var(--bg-surface-container-highest)",
          containerLow: "var(--bg-surface-container-low)",
          containerLowest: "var(--bg-surface-container-lowest)",
          variant: "var(--bg-surface-variant)",
          tint: "#BA9EFF",
        },
        onSurface: {
          DEFAULT: "#DEE5FF",
          variant: "#A3AAC4",
        },
        onPrimary: {
          DEFAULT: "#39008C",
          container: "#2B006E",
          fixed: "#000000",
          fixedVariant: "#370086",
        },
        onSecondary: {
          DEFAULT: "#460027",
          container: "#FFE5EC",
          fixed: "#6B003E",
          fixedVariant: "#9E005E",
        },
        onTertiary: {
          DEFAULT: "#001E4A",
          container: "#000311",
          fixed: "#00163B",
          fixedVariant: "#00377B",
        },
        onTertiaryContainer: {
          DEFAULT: "#000311",
        },
        outline: {
          DEFAULT: "var(--text-outline)",
          variant: "#40485D",
        },
        text: {
          onSurface: "var(--text-on-surface)",
          onSurfaceVariant: "var(--text-on-surface-variant)",
          outline: "var(--text-outline)",
        },
        error: {
          DEFAULT: "#FF6E84",
          container: "#A70138",
          dim: "#D73357",
        },
        onError: {
          DEFAULT: "#490013",
          container: "#FFB2B9",
        },
        inverse: {
          primary: "#6E3BD7",
          surface: "#FAF8FF",
          onSurface: "#4D556B",
        },
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        label: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px",
      },
      spacing: {
        '5rem': '5rem', // Enforce Lumina spacing scale
      },
      transitionTimingFunction: {
        'lumina': 'cubic-bezier(0.23, 1, 0.32, 1)', // Exact spec for 3D interactions
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-indigo-lg': '0 0 30px rgba(99, 102, 241, 0.6)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
      },
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin,
  ],
}
