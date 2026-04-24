export type ThemeName =
  | "default"
  | "fourthOfJuly"
  | "christmas"
  | "thanksgiving"
  | "newYears"
  | "veteransDay";

export type ThemeOverride = "auto" | ThemeName;

export type BannerDecorationType = "none" | "snowLights" | "patrioticBunting";
export type SidebarDecorationType = "none" | "christmas" | "fourthOfJuly";

export type LandingTheme = {
  key: ThemeName;
  label: string;

  heroBannerImage: string;
  heroOverlayColor: string;
  heroImageFit: "cover" | "contain";
  heroImagePosition: string;
  heroBannerBackgroundColor: string;

  bannerDecoration: BannerDecorationType;
  sidebarDecoration: SidebarDecorationType;

  pageBackgroundColor: string;
  pageBackgroundImage: string;
  pageBackgroundRepeat: string;
  pageBackgroundSize: string;
  pageBackgroundPosition: string;

  sidebarBackgroundColor: string;
  sidebarBackgroundImage: string;

  eventCardBackground: string;
  eventCardBorder: string;
  eventTitleColor: string;
  eventDateColor: string;
  eventButtonBackground: string;
  eventButtonText: string;
  eventButtonBorder: string;
};