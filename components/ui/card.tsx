import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-surface)]/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.35),0_0_30px_rgba(99,102,241,0.08)] backdrop-blur-xl transition duration-300 motion-safe:hover:scale-[1.02] hover:bg-[color:var(--bg-surface-2)]",
        className
      )}
      {...props}
    />
  );
}
