export default function MapOrientation() {
  return (
    <div className="map-orientation map-ui-chrome pointer-events-none absolute right-3 top-14 z-[820] grid size-[54px] place-items-center rounded-full border border-slate-200 bg-white/92 shadow-sm backdrop-blur sm:top-3" aria-label="Arah mata angin">
      <span className="map-orientation-label map-orientation-n">U</span>
      <span className="map-orientation-label map-orientation-e">T</span>
      <span className="map-orientation-label map-orientation-s">S</span>
      <span className="map-orientation-label map-orientation-w">B</span>
      <span className="map-orientation-needle" aria-hidden="true" />
    </div>
  );
}
