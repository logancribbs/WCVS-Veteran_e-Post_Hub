"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import WhitmanLogo from "@/app/Images/whitman.png";
import Link from "next/link";
import { LandingTheme } from "@/app/themes/types";

type HeroBannerProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void;
  isAdmin?: boolean;
  theme: LandingTheme;
};

function BannerDecorations({ theme }: { theme: LandingTheme }) {
  if (theme.bannerDecoration === "snowLights") {
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14">
          <div className="relative h-full w-full">
            <div className="absolute left-0 right-0 bottom-6 h-[2px] bg-white/35" />
            <span className="absolute left-[4%] bottom-[20px] text-red-400">●</span>
            <span className="absolute left-[10%] bottom-[8px] text-yellow-300">●</span>
            <span className="absolute left-[16%] bottom-[21px] text-green-400">●</span>
            <span className="absolute left-[24%] bottom-[7px] text-blue-300">●</span>
            <span className="absolute left-[32%] bottom-[20px] text-red-400">●</span>
            <span className="absolute left-[40%] bottom-[8px] text-yellow-300">●</span>
            <span className="absolute left-[48%] bottom-[21px] text-green-400">●</span>
            <span className="absolute left-[56%] bottom-[7px] text-blue-300">●</span>
            <span className="absolute left-[64%] bottom-[20px] text-red-400">●</span>
            <span className="absolute left-[72%] bottom-[8px] text-yellow-300">●</span>
            <span className="absolute left-[80%] bottom-[21px] text-green-400">●</span>
            <span className="absolute left-[88%] bottom-[7px] text-blue-300">●</span>
            <span className="absolute left-[96%] bottom-[20px] text-red-400">●</span>
          </div>
        </div>

        <div className="pointer-events-none absolute left-8 top-8 z-10 text-xl text-white/80">
          ❄
        </div>
        <div className="pointer-events-none absolute right-8 top-8 z-10 text-xl text-white/80">
          ❄
        </div>
      </>
    );
  }

  if (theme.bannerDecoration === "patrioticBunting") {
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-center gap-3 pt-2 text-white/90">
          <span className="text-lg">★</span>
          <span className="text-sm text-red-300">▼</span>
          <span className="text-lg">★</span>
          <span className="text-sm text-white">▼</span>
          <span className="text-lg">★</span>
          <span className="text-sm text-red-300">▼</span>
          <span className="text-lg">★</span>
          <span className="text-sm text-white">▼</span>
          <span className="text-lg">★</span>
        </div>

        <div className="pointer-events-none absolute left-8 top-4 z-10 text-2xl text-white/85">
          ★
        </div>
        <div className="pointer-events-none absolute right-8 top-4 z-10 text-2xl text-white/85">
          ★
        </div>
      </>
    );
  }

  return null;
}

export default function HeroBanner({
  query,
  onQueryChange,
  onSubmit,
  theme,
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
        className="relative flex min-h-[235px] flex-col items-center justify-between overflow-hidden px-6 py-6 md:flex-row md:px-16"
        style={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: theme.heroBannerBackgroundColor,
        }}
      >
        <div className="absolute inset-0">
          <Image
            src={theme.heroBannerImage}
            alt={`${theme.label} banner`}
            fill
            priority
            quality={100}
            unoptimized
            sizes="100vw"
            className={
              theme.heroImageFit === "contain"
                ? "object-contain"
                : "object-cover"
            }
            style={{ objectPosition: theme.heroImagePosition }}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ backgroundColor: theme.heroOverlayColor }}
        />

        <BannerDecorations theme={theme} />

        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <Image
            src={WhitmanLogo}
            alt="Whitman County Logo"
            width={170}
            height={170}
            className="rounded-md drop-shadow-md"
            priority
          />

          <h1 className="text-center text-4xl font-extrabold text-white drop-shadow-[2px_2px_3px_rgba(0,0,0,0.6)] md:text-5xl">
            Veterans e-Post Hub
          </h1>

          <div
            className="relative flex items-center justify-center overflow-hidden rounded-md"
            onMouseEnter={startTimer}
            onMouseLeave={clearTimer}
            tabIndex={0}
          >
            <Image
              src="/WAVA.jpeg"
              alt="Washington State Department of Veterans Affairs"
              width={170}
              height={68}
              className="rounded-md object-contain drop-shadow-md"
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
                  mb-1 rounded-full border border-black/50
                  bg-white px-4 py-2 font-semibold text-black
                  shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md
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
