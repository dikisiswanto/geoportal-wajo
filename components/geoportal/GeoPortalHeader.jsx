import SiteHeader from "../SiteHeader";

export default function GeoPortalHeader({ search, onSearch, onSearchResult }) {
  return (
    <SiteHeader
      active="map"
      title="Peta Interaktif Kabupaten Wajo"
      kicker="Pemerintah Kabupaten Wajo"
      mapSearch
      search={search}
      onSearch={onSearch}
      onSearchResult={onSearchResult}
      searchPlaceholder="Cari tempat, fasilitas, atau data…"
      titleAs="h1"
    />
  );
}
