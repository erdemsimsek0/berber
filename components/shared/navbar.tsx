import type { ReactNode } from "react";

export function Navbar({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-surface)]/80 p-4">
      <div>{left}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}
