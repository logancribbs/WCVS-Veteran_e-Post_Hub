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

  // resource list (PUBLIC)
  const resources = [
    {
      label: "Veteran Health Care",
      href: "https://www.va.gov/spokane-health-care/locations/mann-grandstaff-department-of-veterans-affairs-medical-center/",
    },
    {
      label: "Whitman County Veteran Services",
      href: "https://www.whitmancounty.gov/628/Veteran-Services-Officer",
    },
    {
      label: "Palouse Resource Guide",
      href: "https://palouseresources.org/",
    },
    {
      label: "More Resources",
      href: "/Resources",
    },
  ];

  // ADMIN controls (same style, internal links)
  const adminControls = [
    { label: "Create Event", href: "/Event/create" },
    { label: "Manage Homepage Images", href: "/Admin/slideshow" },
    { label: "Manage Resource Links", href: "/Admin/resources" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAction, setShowAction] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
    const onStorage = (e: StorageEvent) => {
      if (e.key === "role" || e.key === "token") readRole();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
    window.location.href = "/";
  };

  return (
    // Sticky wrapper (NO gradient here — fixes Safari/WebKit compositing bleed)
    <aside
      className="
        w-full
        md:min-w-[340px]
        lg:min-w-[360px]
        md:sticky md:top-6
      "
    >
      {/* Visual container (gradient lives here, not on sticky element) */}
      <div
        className="
          w-full
          bg-gradient-to-b from-[#8C1F1F] via-[#A32626] to-[#ff8c00]
          border-2 border-black/70
          rounded-2xl
          p-5 md:p-6
          flex flex-col
          items-center
          text-white
          shadow-[0_6px_16px_rgba(0,0,0,0.35)]
          gap-4
        "
      >
        {/* Slideshow */}
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
          tabIndex={0}
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

          {slideshowImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full w-7 h-7"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full w-7 h-7"
              >
                ›
              </button>
            </>
          )}

          <div
            className={`
              pointer-events-none absolute inset-x-0 bottom-0 flex justify-center
              transition-all duration-300
              ${showAction ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
            `}
          >
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="pointer-events-auto mb-2 px-4 py-2 rounded-full bg-white text-black font-semibold border border-black/50"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/Login"
                className="pointer-events-auto mb-2 px-4 py-2 rounded-full bg-white text-black font-semibold border border-black/50"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
          <p className="text-md leading-relaxed">
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

        {/* NAV — ONLY THIS PART SWAPS */}
        <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white text-base">
          {(isAdmin ? adminControls : resources).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={isAdmin ? undefined : "_blank"}
              rel={isAdmin ? undefined : "noopener noreferrer"}
              className="
                group flex items-center gap-3 rounded-lg px-3 py-2
                border border-white/20 bg-white/5
                transition-all duration-200
                hover:bg-white/20 hover:border-orange-300 hover:shadow-md
              "
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75 group-hover:animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-200" />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
