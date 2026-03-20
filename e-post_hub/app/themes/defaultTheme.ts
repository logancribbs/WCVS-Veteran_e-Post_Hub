import { LandingTheme } from "./types";

export const defaultTheme: LandingTheme = {
  key: "default",
  label: "Default",

  heroBannerImage: "/palouse_hills.jpg",
  heroOverlayColor: "rgba(0, 0, 0, 0.25)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#617a8d",

  bannerDecoration: "none",
  sidebarDecoration: "none",

  pageBackgroundColor: "#FAF7F2",
  pageBackgroundImage:
    "linear-gradient(rgba(250, 247, 242, 0.50), rgba(250, 247, 242, 0.50)), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px",
  pageBackgroundPosition: "top left",

  sidebarBackgroundColor: "#8C1F1F",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #8C1F1F 0%, #A32626 55%, #ff8c00 100%)",

  eventCardBackground: "#4F5D3A",
  eventCardBorder: "#22301A",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#FFFFFF",
  eventButtonBackground: "rgba(255, 255, 255, 0.92)",
  eventButtonText: "#0F2A22",
  eventButtonBorder: "rgba(255, 255, 255, 0.40)",
};