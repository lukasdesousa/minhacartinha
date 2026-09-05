import type { Metadata } from "next";
import { Benefits } from "@/components/home/benefits";
import { AnimalCause } from "@/components/home/animal-cause";
import { EmotionalSection } from "@/components/home/emotional-section";
import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Navbar } from "@/components/home/navbar";
import { Plans } from "@/components/home/plans";
import { StructuredData } from "@/components/seo/structured-data";
import { absoluteUrl, createPageMetadata, siteConfig } from "@/lib/seo";
import { PREMIUM_PRICE_CENTS } from "@/lib/premium";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: "Minha Cartinha de Amor",
      description: siteConfig.description,
      inLanguage: siteConfig.language,
    },
    {
      "@type": "WebApplication",
      "@id": `${siteConfig.url}/#webapp`,
      url: absoluteUrl("/criar"),
      name: siteConfig.name,
      description: siteConfig.description,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Qualquer dispositivo com navegador",
      inLanguage: siteConfig.language,
      isAccessibleForFree: true,
      offers: [
        { "@type": "Offer", name: "Cartinha Grátis", price: "0", priceCurrency: "BRL" },
        { "@type": "Offer", name: "Premium — compra única por cartinha", price: (PREMIUM_PRICE_CENTS / 100).toFixed(2), priceCurrency: "BRL" },
      ],
      featureList: [
        "Mensagem romântica personalizada",
        "Fotos e momentos especiais",
        "Música do Spotify",
        "Link exclusivo e QR Code",
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fcfaf8]">
      <StructuredData data={homeStructuredData} />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Plans />
        <EmotionalSection />
        <AnimalCause />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
