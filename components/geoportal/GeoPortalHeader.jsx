import SiteHeader from "../SiteHeader";

export default function GeoPortalHeader({ search, onSearch }) {
  return (
    <SiteHeader
      active="map"
      title="Peta Interaktif Kabupaten Wajo"
      kicker="Pemerintah Kabupaten Wajo"
      mapSearch
      search={search}
      onSearch={onSearch}
      searchPlaceholder="Cari data atau wilayah…"
      titleAs="h1"
    />
  );
}
