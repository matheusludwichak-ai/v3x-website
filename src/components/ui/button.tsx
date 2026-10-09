import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] text-[16px] font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border border-ink bg-ink text-[#F3F2EE] hover:-translate-y-px hover:bg-neutral-800 active:translate-y-0 active:bg-black",
        "primary-inverse":
          "border border-[#F3F2EE] bg-[#F3F2EE] text-ink hover:-translate-y-px hover:bg-neutral-200 active:translate-y-0",
        secondary:
          "border border-ink bg-transparent text-ink hover:bg-ink hover:text-[#F3F2EE] active:bg-neutral-800",
        "secondary-inverse":
          "border border-[#F3F2EE] bg-transparent text-[#F3F2EE] hover:bg-[#F3F2EE] hover:text-ink",
        ghost:
          "border-0 bg-transparent px-0 font-medium text-ink underline decoration-1 underline-offset-4 hover:text-accent",
      },
      size: {
        default: "h-[48px] px-7",
        sm: "h-10 px-5 text-[14px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
