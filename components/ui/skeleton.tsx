import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        className
      )}
      {...props}
    />
  );
}
