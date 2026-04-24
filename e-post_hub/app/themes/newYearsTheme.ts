import { LandingTheme } from "./types";

export const newYearsTheme: LandingTheme = {
  key: "newYears",
  label: "New Years",

  heroBannerImage: "/newyears.jpeg",
  heroOverlayColor: "rgba(0, 0, 0, 0.15)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#1F2937",

  bannerDecoration: "none",
  sidebarDecoration: "none",

  pageBackgroundColor: "#374151",
  pageBackgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.06) 2px, transparent 2px)",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "60px 60px",
  pageBackgroundPosition: "top left",

  sidebarBackgroundColor: "#4B5563",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #4B5563 0%, #1F2937 100%)",

  eventCardBackground: "#991B1B",
  eventCardBorder: "#FACC15",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FACC15",
  eventButtonText: "#000000",
  eventButtonBorder: "#EAB308",
};