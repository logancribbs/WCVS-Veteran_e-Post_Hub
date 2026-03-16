import { LandingTheme } from "./types";

export const christmasTheme: LandingTheme = {
  key: "christmas",
  label: "Christmas",

  heroBannerImage: "/snowy_hills.jpeg",
  heroOverlayColor: "rgba(18, 52, 36, 0.16)",
  heroImageFit: "contain",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#b8cedb",

  bannerDecoration: "snowLights",
  sidebarDecoration: "christmas",

  pageBackgroundColor: "#F3F8F1",
  pageBackgroundImage:
    "linear-gradient(rgba(243, 248, 241, 0.80), rgba(243, 248, 241, 0.80)), radial-gradient(circle at 18px 18px, rgba(31, 92, 63, 0.08) 2px, transparent 2px), radial-gradient(circle at 68px 68px, rgba(163, 38, 38, 0.07) 2px, transparent 2px), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px, 120px 120px, 120px 120px, 220px 220px",
  pageBackgroundPosition: "top left, 0 0, 28px 28px, top left",

  sidebarBackgroundColor: "#1F5C3F",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #1F5C3F 0%, #2D7A53 45%, #A32626 100%)",

  eventCardBackground: "#2C5E3F",
  eventCardBorder: "#A32626",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FFF7E6",
  eventButtonText: "#1F5C3F",
  eventButtonBorder: "#E7D8B1",
};