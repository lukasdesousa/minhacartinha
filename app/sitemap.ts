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
    {
      url: absoluteUrl("/termos"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/privacidade"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/cookies"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
