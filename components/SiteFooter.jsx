import Link from "next/link";
import { PUBLISHER_NAME, SITE_NAME } from "../lib/seo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-slate-900">{SITE_NAME}</p>
          <p className="mt-1 text-xs text-slate-500">
            Dikelola oleh {PUBLISHER_NAME} · Pemerintah Kabupaten Wajo
          </p>
        </div>
        <nav className="flex gap-4 text-xs font-medium text-slate-500" aria-label="Navigasi footer">
          <Link href="/" className="hover:text-slate-900">Peta</Link>
          <Link href="/data" className="hover:text-slate-900">Data</Link>
          <Link href="/tentang" className="hover:text-slate-900">Tentang</Link>
        </nav>
      </div>
    </footer>
  );
}
