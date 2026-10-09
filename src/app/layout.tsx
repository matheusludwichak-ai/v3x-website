import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const GA_ID = "G-H3NVMRK99E";

export const metadata: Metadata = {
  metadataBase: new URL("https://grupov3x.com.br"),
  title: {
    default: "V3X — Digital Product Studio",
    template: "%s | V3X",
  },
  description:
    "We turn ideas into digital products. A V3X une estratégia, design e tecnologia para criar sites, sistemas e produtos digitais.",
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
    description: "We turn ideas into digital products. Estratégia, design e tecnologia em um só estúdio.",
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
    description: "We turn ideas into digital products.",
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
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
