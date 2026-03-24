import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-3 text-sm text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur transition placeholder:text-slate-500 focus-visible:border-violet-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/15",
        className
      )}
      {...props}
    />
  );
}
