"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-100 px-6">
      <section className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-7 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600">Terjadi gangguan</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Peta Interaktif Kabupaten Wajo tidak dapat dimuat</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Coba muat ulang halaman. Data peta tidak dihapus dan dapat dimuat kembali setelah aplikasi pulih.</p>
        <button type="button" onClick={() => reset()} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Coba lagi</button>
      </section>
    </main>
  );
}
