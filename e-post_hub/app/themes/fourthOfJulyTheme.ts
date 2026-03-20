import { LandingTheme } from "./types";

export const fourthOfJulyTheme: LandingTheme = {
  key: "fourthOfJuly",
  label: "4th of July",

  heroBannerImage: "/july_4th.jpeg",
  heroOverlayColor: "rgba(0, 0, 0, 0.12)",
  heroImageFit: "cover",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#8F1622",

  bannerDecoration: "patrioticBunting",
  sidebarDecoration: "fourthOfJuly",

  pageBackgroundColor: "#7A0F17",
  pageBackgroundImage:
    "linear-gradient(rgba(122,15,23,0.82), rgba(122,15,23,0.82)), repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 6px, transparent 6px, transparent 18px), radial-gradient(circle at 30px 30px, rgba(255,255,255,0.08) 2px, transparent 2px), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px, 120px 120px, 120px 120px, 220px 220px",
  pageBackgroundPosition: "top left, 0 0, 0 0, top left",

  sidebarBackgroundColor: "#102B66",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #102B66 0%, #1F4A9E 48%, #B22234 100%)",

  eventCardBackground: "#123C7A",
  eventCardBorder: "#F28C38",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FFFFFF",
  eventButtonText: "#102B66",
  eventButtonBorder: "#D1D5DB",
};