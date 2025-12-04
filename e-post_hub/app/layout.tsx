// Used for base layout for all pages. For instance the self contained layout wrappers

import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Components/Providers";
import { EdgeStoreProvider } from "@/lib/edgestore";

// Webpage Font Style
import { Montserrat, Source_Sans_3 } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Veteran e-Post Hub",
  description: "A platform to connect veterans with resources and support.",
  icons: { icon: "./whitman.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${sourceSans.variable}`}>
      <body>
        <EdgeStoreProvider>
          <Providers>
            {/* Removed TopNav — HeroBanner now handles top visuals */}
            <main className="w-full mx-auto">
              {children}
            </main>
          </Providers>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
