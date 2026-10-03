import Image from "next/image";
import Link from "next/link";
import PwaInstallButton from "./geoportal/PwaInstallButton";
import { IconSearch } from "@tabler/icons-react";
import MobileNav from "./geoportal/MobileNav";
import { withAssetVersion } from "../lib/assetVersion";

const WAJO_LOGO = withAssetVersion("/brand/logo-kabupaten-wajo.png");

const NAV_ITEMS = [
  { href: "/", label: "Peta", key: "map" },
  { href: "/data", label: "Data", key: "data" },
  { href: "/tentang", label: "Tentang", key: "about" }
];

export default function SiteHeader({
  active = "",
  title = "Peta Interaktif Kabupaten Wajo",
  kicker = "Pemerintah Kabupaten Wajo",
  mapSearch = false,
  search = "",
  onSearch,
  searchPlaceholder = "Cari data atau wilayah…",
  titleAs = "span"
}) {
  const TitleTag = titleAs === "h1" ? "h1" : "span";

  return (
    <header className="site-header relative z-[1800] flex min-h-14 shrink-0 items-center border-b border-slate-200 bg-white px-3 sm:px-5">
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2.5 rounded-md py-1 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        aria-label="Buka Peta Interaktif Kabupaten Wajo"
      >
        <Image
          src={WAJO_LOGO}
          alt="Lambang Kabupaten Wajo"
          width={42}
          height={42}
          priority
          className="block h-10 w-10 shrink-0 object-contain"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-500">
            {kicker}
          </p>
          <TitleTag className="block truncate text-sm font-semibold text-slate-900">
            {title}
          </TitleTag>
        </div>
      </Link>

      {mapSearch ? (
        <div className="mx-auto hidden w-full max-w-md px-8 md:block">
          <label className="relative block">
            <span className="sr-only">Cari tempat, fasilitas, atau data</span>
            <IconSearch
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              value={search}
              onChange={(event) => onSearch?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 map-text-compact text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </label>
        </div>
      ) : (
        <div className="hidden flex-1 md:block" />
      )}

      <nav className="ml-auto flex items-center gap-1.5 sm:gap-2" aria-label="Navigasi utama">
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
              className={`rounded-md px-2.5 py-1.5 map-text-compact font-medium transition ${
                active === item.key
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <MobileNav active={active} />
        <PwaInstallButton />
      </nav>
    </header>
  );
}
