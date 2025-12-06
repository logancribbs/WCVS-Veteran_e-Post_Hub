"use client";

import Image from "next/image";
import { Input, Button } from "@nextui-org/react";
import { Search, Plus } from "lucide-react";
import WhitmanLogo from "@/app/Images/whitman.png";
import Link from "next/link";

type HeroBannerProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
  isAdmin?: boolean; // 🔸 key: used to toggle Create Event vs WAVA
};

export default function HeroBanner({
  query,
  onQueryChange,
  onSubmit,
  isAdmin = false,
}: HeroBannerProps) {
  return (
    <section className="w-full">
      {/* Top Header */}
      <div
        className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 overflow-hidden"
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundImage: "url('/palouse_hills.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-4">
          {/* Left: County logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src={WhitmanLogo}
              alt="Whitman County Logo"
              width={150}
              height={150}
              className="rounded-md drop-shadow-md"
              priority
            />
          </div>

          {/* Center: Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-[2px_2px_3px_rgba(0,0,0,0.6)]">
            Veterans e-Post Hub
          </h1>

          {/* Right: Create Event (admin) OR WAVA logo (non-admin) */}
          <div className="flex items-center justify-center md:justify-end min-h-[48px]">
            {isAdmin ? (
              <Link href="/Event/create">
                <Button
                  className="
                    group inline-flex items-center gap-2
                    px-6 py-2.5 rounded-full
                    bg-[#ff8c00]
                    text-black font-heading font-semibold
                    border border-black/40
                    shadow-sm
                    hover:bg-[#ffa733]
                    hover:shadow-md
                    hover:-translate-y-0.5
                    transition-all duration-200
                  "
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </Link>
            ) : (
              <Image
                src="/WAVA.jpeg"   // 🔸 ensure the extension matches your file in /public
                alt="Washington State Department of Veterans Affairs"
                width={150}
                height={48}
                className="rounded-md drop-shadow-md object-contain"
                priority
              />
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="flex justify-center py-3"
        style={{
          background:
            "linear-gradient(90deg, #fae6c8 0%, #f8e1b6 50%, #f5dca3 100%)",
        }}
      >
        <div className="w-full max-w-md px-4">
          <Input
            aria-label="Search Events"
            placeholder="Search Events"
            size="md"
            startContent={<Search size={16} />}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
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
