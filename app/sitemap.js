import { layers } from "../lib/layers";
import { absoluteUrl, datasetSlug } from "../lib/seo";

function parseDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function sitemap() {
  const datasetUrls = layers.map((layer) => ({
    url: absoluteUrl(`/data/${datasetSlug(layer)}`),
    ...(parseDate(layer.dataUpdatedAt) ? { lastModified: parseDate(layer.dataUpdatedAt) } : {}),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/data"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/tentang"),
      changeFrequency: "monthly",
      priority: 0.6
    },
    ...datasetUrls
  ];
}
