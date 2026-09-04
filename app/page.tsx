import { Benefits } from "@/components/home/benefits";
import { EmotionalSection } from "@/components/home/emotional-section";
import { FinalCta } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Navbar } from "@/components/home/navbar";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fcfaf8]">
      <Navbar />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
        <Benefits />
        <EmotionalSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
