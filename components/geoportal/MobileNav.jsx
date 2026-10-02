"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";

const NAV_ITEMS = [
  { href: "/", label: "Peta", key: "map" },
  { href: "/data", label: "Data", key: "data" },
  { href: "/tentang", label: "Tentang", key: "about" }
];

export default function MobileNav({ active = "" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-label={open ? "Tutup navigasi utama" : "Buka navigasi utama"}
        aria-expanded={open}
        aria-controls="mobile-main-navigation"
        onClick={() => setOpen((value) => !value)}
        className="relative z-[3] grid size-10 place-items-center rounded-md text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        title={open ? "Tutup navigasi" : "Buka navigasi"}
      >
        {open ? <IconX size={19} stroke={1.8} aria-hidden="true" /> : <IconMenu2 size={19} stroke={1.8} aria-hidden="true" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1] bg-slate-950/5"
          />
          <nav
            id="mobile-main-navigation"
            aria-label="Navigasi utama"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[2] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active === item.key ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-10 items-center rounded-lg px-3 map-text-compact font-medium transition ${
                  active === item.key
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
