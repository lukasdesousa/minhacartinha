import type { Metadata } from "next";

export const siteConfig = {
  name: "Minha Cartinha",
  url: "https://minhacartinha.com.br",
  locale: "pt_BR",
  language: "pt-BR",
  title: "Minha Cartinha | Crie uma Cartinha de Amor Online Grátis",
  description:
    "Crie grátis uma cartinha de amor online com fotos, música e uma mensagem especial. Gere seu link e QR Code para compartilhar com quem você ama.",
  ogImagePath: "/opengraph-image",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const sharedOpenGraph = {
    locale: siteConfig.locale,
    url: path,
    siteName: siteConfig.name,
    title: socialTitle,
    description,
    images: [
      {
        url: siteConfig.ogImagePath,
        width: 1200,
        height: 630,
        alt: "Minha Cartinha — cartinhas de amor online e gratuitas",
      },
    ],
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: type === "article"
      ? { ...sharedOpenGraph, type: "article", publishedTime, modifiedTime }
      : { ...sharedOpenGraph, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [siteConfig.ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
