import Image from "next/image";
import { withAssetVersion } from "../lib/assetVersion";

const SITE_LOGO = withAssetVersion("/brand/logo-kabupaten-wajo.png");

export default function Loading() {
  return (
    <main
      className="grid min-h-dvh place-items-center bg-white px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="flex w-full max-w-sm flex-col items-center text-center">
        <Image
          src={SITE_LOGO}
          alt="Lambang Kabupaten Wajo"
          width="96"
          height="96"
          className="object-contain"
          referrerPolicy="no-referrer"
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Pemerintah Kabupaten Wajo
        </p>
        <h1 className="mt-1 text-sm lg:text-base font-semibold text-slate-900">
          Peta Interaktif Kabupaten Wajo
        </h1>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <span
            className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700"
            aria-hidden="true"
          />
          <span>Memuat peta…</span>
        </div>
      </section>
    </main>
  );
}
