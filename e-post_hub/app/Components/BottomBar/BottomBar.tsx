"use client";

import Link from "next/link";

export default function BottomBar() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      <div className="h-px w-full bg-white/15" />

      <div
        className="w-full py-10 bg-[#243560] text-white"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0),
            linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0))
          `,
          backgroundSize: "18px 18px, 100% 100%",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            
            {/* Left */}
            <div className="space-y-3 text-center md:text-left md:max-w-md">
              <p className="text-lg font-semibold tracking-wide">
                WCVS Veteran e-Post Hub
              </p>
              <p className="text-sm text-white/80">
                Supporting veterans and community engagement through events,
                resources, and announcements.
              </p>
              <p className="text-sm text-white/70">
                Built to connect veterans with support, events, and local opportunities.
              </p>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-10 text-sm md:min-w-[260px]">
              
              {/* Explore */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Explore
                </p>
                <ul className="space-y-1.5 text-white/80">
                  <li>
                    <Link
                      className="transition-all duration-200 hover:text-white hover:translate-x-0.5"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-all duration-200 hover:text-white hover:translate-x-0.5"
                      href="/Support"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Legal
                </p>
                <ul className="space-y-1.5 text-white/80">
                  <li>
                    <Link
                      className="transition-all duration-200 hover:text-white hover:translate-x-0.5"
                      href="/Privacy"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-all duration-200 hover:text-white hover:translate-x-0.5"
                      href="/Terms"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mt-10 border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-white/70">
            <p>© {year} WCVS Veteran e-Post Hub. All rights reserved.</p>
            <p className="text-white/60">
              For any technical assistance, please visit{" "}
              <Link
                href="/Support" // <-- placeholder route
                className="text-white/80 transition-colors duration-200 hover:text-white underline underline-offset-2"
              >
                Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}