import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-[color:var(--border)] bg-[color:var(--bg-surface)] px-3 text-sm text-slate-100 transition placeholder:text-slate-500 focus-visible:border-violet-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20",
        className
      )}
      {...props}
    />
  );
}
