import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-[10px] border border-[color:var(--border)] bg-[color:var(--bg-surface)] px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
