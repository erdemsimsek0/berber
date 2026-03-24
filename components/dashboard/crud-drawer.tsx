"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CrudDrawer({ title, children, buttonLabel }: { title: string; children: React.ReactNode; buttonLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Button type="button" onClick={() => setOpen((prev) => !prev)}>{open ? "Kapat" : buttonLabel}</Button>
      {open ? (
        <div className="rounded-2xl border bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          {children}
        </div>
      ) : null}
    </div>
  );
}
