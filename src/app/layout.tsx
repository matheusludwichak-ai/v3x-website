import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PublicChrome } from "@/components/site/public-chrome";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { VercelMetrics } from "@/components/analytics/VercelMetrics";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grupov3x.com.br"),
  title: {
    default: "V3X — Digital Product Studio",
    template: "%s | V3X",
  },
  description:
    "Criamos produtos digitais que fazem empresas avançarem. A V3X une estratégia, design e tecnologia para criar sites, sistemas e produtos digitais.",
  keywords: [
    "digital product studio",
    "web design e desenvolvimento",
    "motion design",
    "CRM sob medida",
    "desenvolvimento de software",
    "SaaS",
    "MVP",
    "produtos digitais",
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
    title: "V3X — Digital Product Studio",
    description: "Criamos produtos digitais que fazem empresas avançarem. Estratégia, design e tecnologia em um só estúdio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "V3X — Digital Product Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "V3X — Digital Product Studio",
    description: "Criamos produtos digitais que fazem empresas avançarem.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://grupov3x.com.br",
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "any" }],
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <AnalyticsProvider />
        {children}
        <PublicChrome />
        <Toaster />
        <ConsentBanner />
        <VercelMetrics />
      </body>
    </html>
  );
}
