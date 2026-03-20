"use client";

import Link from "next/link";

export default function BottomBar() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      {/* Top divider */}
      <div className="h-px w-full bg-white/15" />

      <div
        className="
          w-full py-10
          bg-[#243560]
          text-white
        "
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0),
            linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0))
          `,
          backgroundSize: "18px 18px, 100% 100%",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
            {/* Left: Brand / short description */}
            <div className="space-y-2">
              <p className="text-lg font-semibold tracking-wide">
                WCVS Veteran e-Post Hub
              </p>
              <p className="text-sm text-white/80 max-w-md">
                Supporting veterans and community engagement through events, resources,
                and announcements.
              </p>
            </div>

            {/* Right: Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-white/90">Explore</p>
                <ul className="space-y-1 text-white/80">
                  <li>
                    <Link className="hover:text-white transition" href="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition" href="/Support">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white/90">Legal</p>
                <ul className="space-y-1 text-white/80">
                  <li>
                    <Link className="hover:text-white transition" href="/Privacy">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white transition" href="/Terms">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-white/70">
            <p>© {year} WCVS Veteran e-Post Hub. All rights reserved.</p>
            <p className="text-white/60">
              For assistance, visit <span className="text-white/80">Support</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}