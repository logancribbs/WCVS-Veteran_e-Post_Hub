export type ThemeName = "default" | "fourthOfJuly" | "christmas";
export type ThemeOverride = "auto" | ThemeName;

export type LandingTheme = {
  key: ThemeName;
  label: string;
  heroBannerImage: string;
  heroOverlayColor: string;
  pageBackgroundColor: string;
  pageBackgroundImage: string;
  sidebarBackgroundColor: string;
  sidebarBackgroundImage: string;
  sidebarAccent: string | null;
  heroAccent: string | null;
  tileAccent: string | null;
  eventCardBackground: string;
  eventCardBorder: string;
  eventTitleColor: string;
  eventDateColor: string;
  eventButtonBackground: string;
  eventButtonText: string;
  eventButtonBorder: string;
};