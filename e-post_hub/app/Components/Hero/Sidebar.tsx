"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import jwt from "jsonwebtoken";
import ManageHomepageImagesModal from "./ManageHomepageImagesModal";
import ManageResourceLinksModal from "./ManageResourceLinksModal";
import ManageLandingThemeModal from "./ManageLandingThemeModal";
import { LandingTheme, ThemeOverride } from "@/app/themes/types";

type ResourceLink = {
  label: string;
  href: string;
};

type SidebarProps = {
  theme: LandingTheme;
  themeOverride: ThemeOverride;
  onThemeSaved: (override: ThemeOverride) => void;
};

function SidebarDecorations({ theme }: { theme: LandingTheme }) {
  if (theme.sidebarDecoration === "christmas") {
    return (
      <>
        <div className="pointer-events-none absolute left-3 top-14 flex flex-col gap-8 text-white/70">
          <span>❄</span>
          <span>❄</span>
          <span>❄</span>
          <span>❄</span>
        </div>

        <div className="pointer-events-none absolute right-3 top-14 flex flex-col gap-8 text-white/70">
          <span>❄</span>
          <span>❄</span>
          <span>❄</span>
          <span>❄</span>
        </div>
      </>
    );
  }

  if (theme.sidebarDecoration === "fourthOfJuly") {
    return (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center gap-2 text-white/85">
          <span className="text-sm text-red-300">▼</span>
          <span>★</span>
          <span className="text-sm text-white">▼</span>
          <span>★</span>
          <span className="text-sm text-red-300">▼</span>
          <span>★</span>
          <span className="text-sm text-white">▼</span>
          <span>★</span>
          <span className="text-sm text-red-300">▼</span>
        </div>
        <div className="pointer-events-none absolute left-2 top-12 flex flex-col gap-8 text-white/75">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <div className="pointer-events-none absolute right-2 top-12 flex flex-col gap-8 text-white/75">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </>
    );
  }

  return null;
}

export default function Sidebar({
  theme,
  themeOverride,
  onThemeSaved,
}: SidebarProps) {
  const defaultSlideshowImages = [
    "/Helmet_w_Flag.jpg",
    "/Landscape_1.jpg",
    "/Landscape_2.jpg",
    "/US_Flags_Veterans.jpg",
    "/Landscape_3.jpg",
  ];

  const defaultResources: ResourceLink[] = [
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

  const adminControls = [
    { label: "Create Event", href: "/Event/create" },
    { label: "Manage Homepage Images", href: "#" },
    { label: "Manage Resource Links", href: "#" },
    { label: "Manage Landing Theme", href: "#" },
  ];

  const [slideshowImages, setSlideshowImages] = useState<string[]>(defaultSlideshowImages);
  const [resources, setResources] = useState<ResourceLink[]>(defaultResources);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAction, setShowAction] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [showResourceManager, setShowResourceManager] = useState(false);
  const [showThemeManager, setShowThemeManager] = useState(false);

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
    const fetchSlideshowImages = async () => {
      try {
        const response = await fetch("/api/slideshow", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();

        if (Array.isArray(data.images) && data.images.length > 0) {
          setSlideshowImages(data.images);
        }
      } catch {}
    };

    fetchSlideshowImages();
  }, []);

  useEffect(() => {
    const fetchResourceLinks = async () => {
      try {
        const response = await fetch("/api/resource-links", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();

        if (Array.isArray(data.links) && data.links.length > 0) {
          setResources(data.links);
        }
      } catch {}
    };

    fetchResourceLinks();
  }, []);

  useEffect(() => {
    if (currentIndex >= slideshowImages.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slideshowImages.length]);

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
    <>
      <aside
        className="
          relative
          w-full
          md:min-w-[340px]
          lg:min-w-[360px]
          border-2 border-black/70
          rounded-2xl
          p-5 md:p-6
          flex flex-col
          items-center
          text-white
          shadow-[0_6px_16px_rgba(0,0,0,0.35)]
          md:sticky md:top-6
          gap-4
          isolate
          transform-gpu
          overflow-hidden
        "
        style={{
          backgroundColor: theme.sidebarBackgroundColor,
          backgroundImage: theme.sidebarBackgroundImage,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          mixBlendMode: "normal",
        }}
      >
        <SidebarDecorations theme={theme} />

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
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={slideshowImages[currentIndex]}
              alt="Veteran Services photos"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              unoptimized
            />
          </div>

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

        <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white text-base">
          {(isAdmin ? adminControls : resources).map((item) => {
            if (isAdmin && item.label === "Manage Homepage Images") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowImageManager(true)}
                  className="
                    group flex items-center gap-3 rounded-lg px-3 py-2
                    border border-white/20 bg-white/5
                    transition-all duration-200
                    hover:bg-white/20 hover:border-orange-300 hover:shadow-md
                    w-full text-left
                  "
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75 group-hover:animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-200" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            }

            if (isAdmin && item.label === "Manage Resource Links") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowResourceManager(true)}
                  className="
                    group flex items-center gap-3 rounded-lg px-3 py-2
                    border border-white/20 bg-white/5
                    transition-all duration-200
                    hover:bg-white/20 hover:border-orange-300 hover:shadow-md
                    w-full text-left
                  "
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75 group-hover:animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-200" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            }

            if (isAdmin && item.label === "Manage Landing Theme") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowThemeManager(true)}
                  className="
                    group flex items-center gap-3 rounded-lg px-3 py-2
                    border border-white/20 bg-white/5
                    transition-all duration-200
                    hover:bg-white/20 hover:border-orange-300 hover:shadow-md
                    w-full text-left
                  "
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange-200 opacity-75 group-hover:animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-200" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            }

            return (
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
            );
          })}
        </nav>
      </aside>

      <ManageHomepageImagesModal
        isOpen={showImageManager}
        onClose={() => setShowImageManager(false)}
        images={slideshowImages}
        onSaved={(updatedImages) => {
          setSlideshowImages(updatedImages);
          setCurrentIndex(0);
        }}
      />

      <ManageResourceLinksModal
        isOpen={showResourceManager}
        onClose={() => setShowResourceManager(false)}
        links={resources}
        onSaved={(updatedLinks: ResourceLink[]) => {
          setResources(updatedLinks);
        }}
      />

      <ManageLandingThemeModal
        isOpen={showThemeManager}
        onClose={() => setShowThemeManager(false)}
        currentOverride={themeOverride}
        onSaved={(updatedOverride) => {
          onThemeSaved(updatedOverride);
        }}
      />
    </>
  );
}