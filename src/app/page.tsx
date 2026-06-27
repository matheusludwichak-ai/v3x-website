import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductsSection } from "@/components/products-section";
import { MethodologySection } from "@/components/methodology-section";
import { DiagnosticoCTA } from "@/components/diagnostico-cta";
import { BlogPreview } from "@/components/blog-preview";
import { Footer } from "@/components/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "V3X",
  url: "https://grupov3x.com.br",
  description:
    "Ecossistema de ferramentas e metodologias para empresas que querem crescer com estratégia, escala e performance.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <ProductsSection />
        <MethodologySection />
        <DiagnosticoCTA />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
}
