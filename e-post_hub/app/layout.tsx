// Used for base layout for all pages. For instance the self contained layout wrappers

import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Components/Providers";
import { EdgeStoreProvider } from "@/lib/edgestore";

// Webpage Font Style
import { Roboto, Inter } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

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
    <html lang="en" className={inter.className}>
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
