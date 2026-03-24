"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function Tabs({
  items,
  defaultValue,
  onChange
}: {
  items: { label: string; value: string }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value ?? "");

  return (
    <div className="inline-flex rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-surface)] p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => {
            setActive(item.value);
            onChange?.(item.value);
          }}
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium transition",
            active === item.value ? "bg-violet-500/20 text-violet-100" : "text-slate-400 hover:text-white"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
