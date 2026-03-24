import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-white/10 text-slate-200",
      accent: "bg-gradient-to-r from-violet-500/30 to-blue-500/30 text-violet-100 border border-violet-300/30",
      success: "bg-emerald-500/20 text-emerald-200 border border-emerald-300/20"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({ className, variant, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
