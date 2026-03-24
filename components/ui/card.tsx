import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 motion-safe:hover:scale-[1.01] hover:border-white/20 hover:shadow-[0_16px_45px_rgba(0,0,0,0.45)]",
        className
      )}
      {...props}
    />
  );
}
