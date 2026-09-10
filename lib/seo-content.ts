import { absoluteUrl, siteConfig } from "@/lib/seo";
import type { BreadcrumbItem, FaqItem } from "@/components/seo/content-page";

type StructuredPageInput = {
  path: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FaqItem[];
  kind?: "article" | "webpage";
  datePublished?: string;
  dateModified?: string;
};

export function createStructuredPage({
  path,
  title,
  description,
  breadcrumbs,
  faqs = [],
  kind = "webpage",
  datePublished,
  dateModified,
}: StructuredPageInput) {
  const url = absoluteUrl(path);
  const page = kind === "article"
    ? {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        image: absoluteUrl(siteConfig.ogImagePath),
        inLanguage: siteConfig.language,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      }
    : {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: siteConfig.language,
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      page,
      ...(kind === "article"
        ? [{
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: title,
            description,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
            inLanguage: siteConfig.language,
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: absoluteUrl(item.href ?? path),
        })),
      },
      ...(faqs.length
        ? [{
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }]
        : []),
    ],
  };
}
