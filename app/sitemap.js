import { layers } from "../lib/layers";
import { absoluteUrl, datasetSlug } from "../lib/seo";

export default function sitemap() {
  const datasetUrls = layers.map((layer) => ({
    url: absoluteUrl(`/data/${datasetSlug(layer)}`),
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
