import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#182522",
        forest: {
          50: "#f1f6f4",
          100: "#dce9e4",
          500: "#376859",
          700: "#214a3e",
          900: "#142f29"
        },
        amber: {
          50: "#fff8ea",
          400: "#dca847",
          500: "#c78b2e",
          600: "#aa7020"
        },
        warm: "#f7f4ed"
      },
      boxShadow: { soft: "0 18px 55px rgba(20,47,41,.09)" },
      borderRadius: { xl2: "1.25rem" }
    }
  },
  plugins: []
} satisfies Config;
