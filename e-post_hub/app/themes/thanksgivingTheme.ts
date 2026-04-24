import { LandingTheme } from "./types";

export const thanksgivingTheme: LandingTheme = {
  key: "thanksgiving",
  label: "Thanksgiving",

  heroBannerImage: "/thanksgiving.jpeg",
  heroOverlayColor: "rgba(92, 51, 23, 0.15)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#8B4513",

  bannerDecoration: "none",
  sidebarDecoration: "none",

  pageBackgroundColor: "#7B3F00",
  pageBackgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 8px, transparent 8px, transparent 20px)",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "auto",
  pageBackgroundPosition: "top left",

  sidebarBackgroundColor: "#5C3317",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #5C3317 0%, #8B4513 100%)",

  eventCardBackground: "#3F6212",
  eventCardBorder: "#D4A373",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FFF4E6",
  eventButtonText: "#5C3317",
  eventButtonBorder: "#D4A373",
};