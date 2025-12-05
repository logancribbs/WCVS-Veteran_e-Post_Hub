"use client";

import Image from "next/image";
import { Input, Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import WhitmanLogo from "@/app/Images/whitman.png";
import Link from "next/link";
import { Plus } from "lucide-react";

type HeroBannerProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
};

export default function HeroBanner({ query, onQueryChange, onSubmit }: HeroBannerProps) {
  return (
    <section className="w-full">
      {/* Top Header */}
      <div
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6"
        style={{
          background:
            "linear-gradient(135deg, #ffb547ff 0%, #ff9838ff 50%, #ff5500 100%)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
          <Image
            src={WhitmanLogo}
            alt="Logo"
            width={150}
            height={150}
            className="rounded-md drop-shadow-md"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.2)]">
          Veterans e-Post Hub
        </h1>

        {/* Create Event Button */}
        <div className="flex items-center justify-center md:justify-end mt-4 md:mt-0">
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
        </div>
      </div>

      {/* Search Bar */}
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
