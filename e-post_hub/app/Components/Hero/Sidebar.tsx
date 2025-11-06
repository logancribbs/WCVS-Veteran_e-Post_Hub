"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <aside
      className="
        w-full md:w-96 
        bg-[#65282D]  /* deeper, richer red */
        rounded-lg 
        p-5 
        flex flex-col 
        items-center 
        text-white 
        shadow-2xl
      "
    >
      {/* Client photo */}
      <div className="w-full mb-5 flex justify-center">
        <Image
          src="/buri_photo.jpeg"
          alt="Becky Buri - Whitman County Veterans Services"
          width={420}
          height={260}
          className="
            object-cover 
            rounded-lg 
            border-2 
            border-gray-300 
            shadow-md
          "
          priority
        />
      </div>

      {/* Contact Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Contact Info</h3>
        <p className="text-sm leading-relaxed text-white">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:BeckyBuri@whitmancounty.gov"
            className="text-blue-300 hover:text-blue-400 underline"
          >
            BeckyBuri@whitmancounty.gov
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+15093975246"
            className="text-blue-300 hover:text-blue-400 underline"
          >
            +1 (509)-397-5246
          </a>
        </p>
      </div>

      {/* Resource Links */}
      <nav className="w-full flex flex-col gap-2 text-left font-semibold text-white">
        <a
          href="https://www.va.gov/spokane-health-care/locations/mann-grandstaff-department-of-veterans-affairs-medical-center/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition-colors"
        >
          - Veteran Health Care
        </a>
        <a href="#" className="hover:text-blue-300 transition-colors">
          - Community Questions
        </a>
        <a href="#" className="hover:text-blue-300 transition-colors">
          - Palouse Resource Guide
        </a>
        <a href="#" className="hover:text-blue-300 transition-colors">
          - Office Hours
        </a>
      </nav>
    </aside>
  );
}


