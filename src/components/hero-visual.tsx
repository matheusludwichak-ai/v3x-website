import Image from "next/image";

/**
 * Composição da primeira dobra: janelas reais de produto (Veredito) sobrepostas,
 * em ângulos distintos — demonstra competência em vez de ilustrar com genérico.
 */
export function HeroVisual() {
  return (
    <div className="relative hidden h-[480px] w-full lg:block" aria-hidden="true">
      <div className="absolute left-[6%] top-[6%] w-[62%] -rotate-2 shadow-2xl transition-transform duration-500 hover:rotate-0">
        <div className="product-window border-dark-border">
          <div className="window-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/work/veredito/dashboard.jpg"
              alt="Veredito — dashboard do CRM jurídico em desenvolvimento pela V3X"
              fill
              sizes="480px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4%] right-[2%] w-[48%] rotate-3 shadow-2xl transition-transform duration-500 hover:rotate-0">
        <div className="product-window border-dark-border">
          <div className="window-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/work/veredito/pipeline.jpg"
              alt="Veredito — pipeline comercial visual"
              fill
              sizes="380px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="absolute right-[18%] top-0 flex h-16 w-16 items-center justify-center rounded-full border border-dark-border bg-dark-surface">
        <Image src="/brand/mark.png" alt="" width={28} height={28} />
      </div>
    </div>
  );
}
