import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/criar"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/transparencia"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
