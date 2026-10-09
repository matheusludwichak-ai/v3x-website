import Image from "next/image";

export function ProductWindow({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 640px, 100vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="product-window">
      <div className="window-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
