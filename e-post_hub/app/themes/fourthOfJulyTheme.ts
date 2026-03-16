import { LandingTheme } from "./types";

export const fourthOfJulyTheme: LandingTheme = {
  key: "fourthOfJuly",
  label: "4th of July",

  heroBannerImage: "/july_4th.jpeg",
  heroOverlayColor: "rgba(7, 24, 64, 0.22)",
  heroImageFit: "contain",
  heroImagePosition: "center center",
  heroBannerBackgroundColor: "#123c7a",

  bannerDecoration: "patrioticBunting",
  sidebarDecoration: "fourthOfJuly",

  pageBackgroundColor: "#EEF4FF",
  pageBackgroundImage:
    "linear-gradient(rgba(238, 244, 255, 0.78), rgba(238, 244, 255, 0.78)), radial-gradient(circle at 20px 20px, rgba(17, 60, 122, 0.08) 2px, transparent 2px), radial-gradient(circle at 70px 70px, rgba(178, 34, 52, 0.08) 2px, transparent 2px), url('/bg-floral.png')",
  pageBackgroundRepeat: "repeat",
  pageBackgroundSize: "220px 220px, 120px 120px, 120px 120px, 220px 220px",
  pageBackgroundPosition: "top left, 0 0, 30px 30px, top left",

  sidebarBackgroundColor: "#102B66",
  sidebarBackgroundImage:
    "linear-gradient(to bottom, #102B66 0%, #1F4A9E 48%, #B22234 100%)",

  eventCardBackground: "#123C7A",
  eventCardBorder: "#B22234",
  eventTitleColor: "#FFFFFF",
  eventDateColor: "#F9FAFB",
  eventButtonBackground: "#FFFFFF",
  eventButtonText: "#102B66",
  eventButtonBorder: "#D1D5DB",
};