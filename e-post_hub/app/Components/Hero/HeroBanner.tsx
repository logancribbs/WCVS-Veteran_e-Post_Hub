"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import WhitmanLogo from "@/app/Images/whitman.png";
import Link from "next/link";

type HeroBannerProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
};

export default function HeroBanner({
  query,
  onQueryChange,
  onSubmit,
}: HeroBannerProps) {
  const [showRegister, setShowRegister] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      setShowRegister(true);
      timerRef.current = null;
    }, 3000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowRegister(false);
  };

  return (
    <section className="w-full">
      <div
        className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 overflow-hidden"
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundImage: "url('/palouse_hills.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-4">
          {/* Left */}
          <Image
            src={WhitmanLogo}
            alt="Whitman County Logo"
            width={170}
            height={170}
            className="rounded-md drop-shadow-md"
            priority
          />

          {/* Center */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-[2px_2px_3px_rgba(0,0,0,0.6)]">
            Veterans e-Post Hub
          </h1>

          {/* Right – ALWAYS WAVA */}
          <div
            className="relative flex items-center justify-center rounded-md overflow-hidden"
            onMouseEnter={startTimer}
            onMouseLeave={clearTimer}
            tabIndex={0}
          >
            <Image
              src="/WAVA.jpeg"
              alt="Washington State Department of Veterans Affairs"
              width={170}
              height={68}
              className="rounded-md drop-shadow-md object-contain"
              priority
            />

            <div
              className={`
                absolute inset-x-0 bottom-0 z-50 flex justify-center
                transition-all duration-300
                ${
                  showRegister
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }
              `}
            >
              <Link
                href="/Registeradmin"
                className="
                  mb-1 px-4 py-2 rounded-full
                  bg-white text-black font-semibold
                  border border-black/50
                  shadow-sm hover:shadow-md hover:-translate-y-0.5
                  transition-all
                "
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
