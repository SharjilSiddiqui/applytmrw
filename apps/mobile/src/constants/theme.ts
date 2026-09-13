import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1F2937",
    background: "#FFFCFA",

    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FFF1E8",

    textSecondary: "#64748B",

    primary: "#FF7A1A",
    primaryDark: "#EA580C",
    primaryLight: "#FFF1E8",

    border: "#E5E7EB",
  },

  dark: {
    text: "#F9FAFB",
    background: "#111827",

    backgroundElement: "#1F2937",
    backgroundSelected: "#3A2A20",

    textSecondary: "#94A3B8",

    primary: "#FF7A1A",
    primaryDark: "#FB923C",
    primaryLight: "#3A2A20",

    border: "#374151",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

export const MaxContentWidth = 800;
