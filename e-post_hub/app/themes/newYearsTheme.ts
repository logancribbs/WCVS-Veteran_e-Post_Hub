import { LandingTheme } from "./types";

export const newYearsTheme: LandingTheme = {
  key: "newYears",
  label: "New Years",

  heroBannerImage: "/newyear.jpeg",
  heroOverlayColor: "rgba(0, 0, 0, 0.2)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#111827",

  bannerDecoration: "none",
  sidebarDecoration: "none",

  pageBackgroundColor: "#000000",
  pageBackgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.08) 2px, transparent 2px)",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "60px 60px",
  pageBackgroundPosition: "top left",

  sidebarBackgroundColor: "#1F2937",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #1F2937 0%, #000000 100%)",

  eventCardBackground: "#111827",
  eventCardBorder: "#FACC15",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FACC15",
  eventButtonText: "#000000",
  eventButtonBorder: "#EAB308",
};