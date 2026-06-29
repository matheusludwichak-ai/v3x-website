import type { Metadata } from "next";
import Script from "next/script";
import { AnaliseForm } from "@/components/analise-form";

export const metadata: Metadata = {
  title: "Análise Estratégica Gratuita | V3X",
  description: "Receba gratuitamente uma análise estratégica para identificar os gargalos e oportunidades de crescimento da sua empresa.",
  robots: { index: false, follow: false }, // não indexar — página de anúncio
};

export default function AnalisePage() {
  return (
    <>
      {/* ── Meta Pixel ──────────────────────────────────────────────────────
          Substitua META_PIXEL_ID pelo seu ID real no painel do Meta Ads.
          Exemplo: 123456789012345
      ─────────────────────────────────────────────────────────────────────── */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'META_PIXEL_ID');
        fbq('track', 'PageView');
      `}</Script>

      {/* ── Google Tag Manager ──────────────────────────────────────────────
          Substitua GTM-XXXXXXX pelo seu ID do GTM.
          Exemplo: GTM-ABC1234
      ─────────────────────────────────────────────────────────────────────── */}
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-XXXXXXX');
      `}</Script>

      <AnaliseForm />
    </>
  );
}
