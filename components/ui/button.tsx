import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/25",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-500 via-blue-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)] hover:scale-[1.02] hover:shadow-[0_10px_34px_rgba(139,92,246,0.45)]",
        outline: "border border-white/20 bg-white/5 text-slate-100 hover:scale-[1.02] hover:bg-white/10",
        ghost: "text-slate-300 hover:bg-white/10 hover:text-white"
      },
      size: {
        default: "h-11 px-4 text-sm",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-8 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
