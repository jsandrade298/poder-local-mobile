/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0966C2",
          light: "#3B8AD9",
          dark: "#074D8F",
          bg: "#EBF4FF",
          "bg-soft": "#F0F7FF",
        },
        secondary: {
          DEFAULT: "#29A575",
          light: "#3DBF8E",
          dark: "#1E7D59",
          bg: "#ECFDF5",
        },
        page: "#F8FAFC",
        card: "#FFFFFF",
        border: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
        },
        txt: {
          DEFAULT: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        destructive: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FFFBEB",
        },
        success: {
          DEFAULT: "#10B981",
          bg: "#ECFDF5",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        medium: ["Inter_500Medium", "System"],
        semibold: ["Inter_600SemiBold", "System"],
        bold: ["Inter_700Bold", "System"],
        extrabold: ["Inter_800ExtraBold", "System"],
      },
      borderRadius: {
        card: "12px",
        lg: "16px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};
