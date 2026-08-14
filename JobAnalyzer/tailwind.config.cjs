/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F33",
        atlantic: "#0E5673",
        reef: "#00A7A0",
        mangrove: "#087F70",
        coqui: "#F4B942",
        shell: "#F4F8F7",
        mist: "#DCE9E7",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui"],
        body: ['"Source Sans 3"', "ui-sans-serif", "system-ui"],
        data: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        tide: "0 24px 60px -28px rgba(11, 31, 51, 0.38)",
      },
    },
  },
  plugins: [],
};
