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
      url: absoluteUrl("/presente-digital"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/guias"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/guias/como-escrever-uma-carta-de-amor"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl("/guias/ideias-de-surpresa-romantica"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: absoluteUrl("/guias/aniversario-de-namoro"),
      changeFrequency: "monthly",
      priority: 0.75,
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
