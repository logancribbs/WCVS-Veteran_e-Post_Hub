"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import jwt from "jsonwebtoken";

export default function Sidebar() {
  // slideshow images
  const slideshowImages = [
    "/Helmet_w_Flag.jpg",
    "/Landscape_1.jpg",
    "/Landscape_2.jpg",
    "/US_Flags_Veterans.jpg",
    "/Landscape_3.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // hover-to-reveal action (Login or Logout)
  const [showAction, setShowAction] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // admin state
  const [isAdmin, setIsAdmin] = useState(false);

  // Read role from localStorage; fallback to token decode; also listen for role changes
  useEffect(() => {
    const readRole = () => {
      const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
      if (role) {
        setIsAdmin(role === "ADMIN");
        return;
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const decoded = jwt.decode(token) as { role?: string } | null;
          setIsAdmin(decoded?.role === "ADMIN");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    readRole();

    // In case other parts of the app change localStorage (e.g., LoginForm), keep in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === "role" || e.key === "token") readRole();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // auto-advance every 5 sec
  useEffect(() => {
    if (slideshowImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const startHoverTimer = () => {
    if (hoverTimerRef.current) return;
    hoverTimerRef.current = setTimeout(() => {
      setShowAction(true);
      hoverTimerRef.current = null;
    }, 3000);
  };

  const clearHoverTimerAndHide = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowAction(false);
  };

  const showPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideshowImages.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch {}
    // hard reload the homepage so HeroBanner & Sidebar re-evaluate isAdmin
    window.location.href = "/";
  };

  return (
    <aside
      className="
        w-full
        md:min-w-[340px]
        lg:min-w-[360px]
        bg-gradient-to-b from-[#8C1F1F] via-[#A32626] to-[#ff8c00]
        border-2 border-black/70
        rounded-2xl
        p-5 md:p-6
        flex flex-col
        items-center
        text-white
        shadow-[0_6px_16px_rgba(0,0,0,0.35)]
        md:sticky md:top-6
        gap-4
      "
    >
      <div
        className="
          w-full max-w-[320px]
          rounded-lg
          border border-gray-300
          overflow-hidden
          relative
          shadow-md
        "
        onMouseEnter={startHoverTimer}
        onMouseLeave={clearHoverTimerAndHide}
        onFocus={startHoverTimer}
        onBlur={clearHoverTimerAndHide}
        tabIndex={0}
        aria-label="Slideshow"
      >
        <Image
          src={slideshowImages[currentIndex]}
          alt="Veteran Services photos"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto object-contain"
          unoptimized
        />

        {/* Prev/Next controls */}
        {slideshowImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="
                absolute left-2 top-1/2 -translate-y-1/2
                bg-black/40 hover:bg-black/60
                text-white
                rounded-full
                w-7 h-7
                flex items-center justify-center
                text-xs
                transition-colors
              "
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                bg-black/40 hover:bg-black/60
                text-white
                rounded-full
                w-7 h-7
                flex items-center justify-center
                text-xs
                transition-colors
              "
              aria-label="Next image"
            >
              ›
            </button>

            {/* Dots */}
            <div
              className="
                absolute bottom-2 left-1/2 -translate-x-1/2
                flex gap-1.5
              "
            >
              {slideshowImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`
                    h-2 w-2 rounded-full
                    ${idx === currentIndex ? "bg-white" : "bg-white/50"}
                  `}
                />
              ))}
            </div>
          </>
        )}

        {/* Hidden Login/Logout action: slides up after 3s hover */}
        <div
          className={`
            pointer-events-none
            absolute inset-x-0 bottom-0
            flex justify-center
            transition-all duration-300
            ${showAction ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
          `}
        >
          {isAdmin ? (
            <button
              type="button"
              onClick={handleLogout}
              className="
                pointer-events-auto
                mb-2
                inline-flex items-center justify-center
                px-4 py-2
                rounded-full
                bg-white text-black font-semibold
                border border-black/50
                shadow
                hover:translate-y-[-2px]
                hover:shadow-md
                transition
              "
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/Login"
              className="
                pointer-events-auto
                mb-2
                inline-flex items-center justify-center
                px-4 py-2
                rounded-full
                bg-white text-black font-semibold
                border border-black/50
                shadow
                hover:translate-y-[-2px]
                hover:shadow-md
                transition
              "
              aria-label="Go to login page"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <p className="text-sm leading-relaxed">
          <strong>Email:</strong>{" "}
          <a href="mailto:BeckyBuri@whitmancounty.gov" className="text-blue-300 hover:underline">
            BeckyBuri@whitmancounty.gov
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+15093975246" className="text-blue-300 hover:underline">
            +1 (509)-397-5246
          </a>
        </p>
      </div>

      <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white text-base">
        <a
          href="https://www.va.gov/spokane-health-care/locations/mann-grandstaff-department-of-veterans-affairs-medical-center/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          - Veteran Health Care
        </a>

        <a
          href="https://www.whitmancounty.gov/628/Veteran-Services-Officer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          - Whitman County Veteran Services
        </a>

        <a
          href="https://palouseresources.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          - Palouse Resource Guide
        </a>
      </nav>
    </aside>
  );
}
