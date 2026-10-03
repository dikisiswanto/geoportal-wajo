const DEFAULT_VERSION = "dev";

export const ASSET_VERSION =
  process.env.NEXT_PUBLIC_ASSET_VERSION?.trim() || DEFAULT_VERSION;

export function withAssetVersion(url, version = ASSET_VERSION) {
  if (!url || typeof url !== "string") return url;
  if (/^(?:[a-z]+:|data:|blob:|#)/i.test(url)) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}
