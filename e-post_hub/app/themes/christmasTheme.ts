import { LandingTheme } from "./types";

export const christmasTheme: LandingTheme = {
  key: "christmas",
  label: "Christmas",

  heroBannerImage: "/christmas.jpeg",
  heroOverlayColor: "rgba(18, 52, 36, 0.10)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#b8cedb",

  bannerDecoration: "snowLights",
  sidebarDecoration: "christmas",

  pageBackgroundColor: "#F7EFEF",
  pageBackgroundImage:
    "linear-gradient(rgba(247, 239, 239, 0.74), rgba(247, 239, 239, 0.74)), repeating-linear-gradient(135deg, rgba(170, 36, 36, 0.10) 0px, rgba(170, 36, 36, 0.10) 18px, rgba(255, 255, 255, 0.10) 18px, rgba(255, 255, 255, 0.10) 36px), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px, 180px 180px, 220px 220px",
  pageBackgroundPosition: "top left, 0 0, top left",

  sidebarBackgroundColor: "#1F5C3F",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #1F5C3F 0%, #2D7A53 45%, #A32626 100%)",

  eventCardBackground: "#2C5E3F",
  eventCardBorder: "#C94A4A",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FFF7E6",
  eventButtonText: "#1F5C3F",
  eventButtonBorder: "#E7D8B1",
};