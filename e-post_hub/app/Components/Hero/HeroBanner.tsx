"use client";

import Image from "next/image";
import { Input, Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import WhitmanLogo from "@/app/Images/whitman.png";
import Link from "next/link";

// NEW: accept props from page.tsx
//  - query: controlled value from parent
//  - onQueryChange: callback to update search state
//  - onSubmit: optional handler (if you want a Search button or Enter key to trigger filtering manually)
type HeroBannerProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
};

// CHANGED: use props instead of a bare function with no arguments
export default function HeroBanner({ query, onQueryChange, onSubmit }: HeroBannerProps) {
  return (
    <section className="w-full">
      {/* Top header section */}
      <div
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6"
        style={{
          background:
            "linear-gradient(135deg, #ff9900 0%, #ff7b00 50%, #ff5500 100%)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Logo on the left */}
        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
          <Image
            src={WhitmanLogo}
            alt="Whitman County Veterans Services Logo"
            width={120}
            height={120}
            className="rounded-md drop-shadow-md"
            priority
          />
        </div>

        {/* Center title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.2)]">
          Veterans e-Post Hub
        </h1>

        {/* Create Event button on the right */}
        <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0">
          <Link href="/Event/create">
            <Button
              className="bg-[#ff8c00] border-2 border-black text-black font-semibold px-6 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#ff7b00] transition-all duration-200"
            >
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Lower section (search bar) */}
      <div
        className="flex justify-center py-5"
        style={{
          background:
            "linear-gradient(90deg, #fae6c8 0%, #f8e1b6 50%, #f5dca3 100%)",
        }}
      >
        <div className="w-full max-w-md px-4">
          <Input
            aria-label="Search Events"
            placeholder="Search Events"
            size="lg"
            startContent={<Search size={18} />}

            // NEW: controlled value
            value={query}

            // NEW: update parent when user types
            onChange={(e) => onQueryChange(e.target.value)}

            // OPTIONAL: let Enter key trigger a manual search if provided
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSubmit) onSubmit();
            }}

            classNames={{
              input: "text-base px-4",
              inputWrapper:
                "rounded-full border-2 border-black bg-white/80 hover:border-black focus-within:border-black transition-all duration-200 shadow-sm",
            }}
          />
        </div>
      </div>
    </section>
  );
}
