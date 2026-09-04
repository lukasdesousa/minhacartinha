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
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
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
    },
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
