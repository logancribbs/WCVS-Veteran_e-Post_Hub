import { LandingTheme } from "./types";

export const christmasTheme: LandingTheme = {
  key: "christmas",
  label: "Christmas",

  heroBannerImage: "/snowy_hills.jpeg",
  heroOverlayColor: "rgba(18, 52, 36, 0.14)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#b8cedb",

  bannerDecoration: "snowLights",
  sidebarDecoration: "christmas",

  pageBackgroundColor: "#F1F7EF",
  pageBackgroundImage:
    "linear-gradient(rgba(241, 247, 239, 0.84), rgba(241, 247, 239, 0.84)), radial-gradient(circle at 18px 18px, rgba(31, 92, 63, 0.10) 2px, transparent 2px), radial-gradient(circle at 68px 68px, rgba(163, 38, 38, 0.08) 2px, transparent 2px), linear-gradient(135deg, rgba(255,255,255,0.16) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.16) 75%, transparent 75%, transparent), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px, 120px 120px, 120px 120px, 140px 140px, 220px 220px",
  pageBackgroundPosition: "top left, 0 0, 28px 28px, 0 0, top left",

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
