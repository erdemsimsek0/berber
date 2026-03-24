import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("space-y-6 sm:space-y-7", className)} {...props} />;
}
