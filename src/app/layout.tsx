import type { Metadata } from "next";
import { Anton, Montserrat, Inter, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grupov3x.com.br"),
  title: {
    default: "V3X — Estratégia, Escala e Performance para Empresas",
    template: "%s | V3X",
  },
  description:
    "A V3X é um ecossistema de ferramentas e metodologias para empresas que querem crescer com estratégia, escala e performance. Diagnóstico empresarial, CRM comercial e muito mais.",
  keywords: [
    "diagnóstico empresarial",
    "gestão empresarial",
    "escalabilidade",
    "benchmarking",
    "pipeline de vendas",
    "CRM comercial",
    "inteligência artificial para empresas",
    "gestão de vendas",
    "desenvolvimento empresarial",
    "consultoria empresarial",
  ],
  authors: [{ name: "V3X", url: "https://grupov3x.com.br" }],
  creator: "V3X",
  publisher: "V3X",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://grupov3x.com.br",
    siteName: "V3X",
    title: "V3X — Estratégia, Escala e Performance para Empresas",
    description:
      "A V3X é um ecossistema de ferramentas e metodologias para empresas que querem crescer com estratégia, escala e performance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "V3X — Estratégia · Escala · Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "V3X — Estratégia, Escala e Performance para Empresas",
    description:
      "Ferramentas e metodologias para empresas que querem crescer com estratégia, escala e performance.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://grupov3x.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${montserrat.variable} ${inter.variable} ${bebasNeue.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
