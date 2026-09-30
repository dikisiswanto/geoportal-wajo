export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-slate-100 px-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" aria-live="polite" aria-busy="true">
        <div className="flex items-center gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">W</div>
          <div className="min-w-0 flex-1">
            <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-5 w-56 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mt-6 h-56 animate-pulse rounded-2xl bg-slate-100" />
        <p className="mt-4 text-sm text-slate-500">Menyiapkan Geoportal Kabupaten Wajo…</p>
      </section>
    </main>
  );
}
