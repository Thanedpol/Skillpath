"use client";

import { useEffect } from "react";

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`scrim${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`drawer${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="d-sk">
        <button className="dclose" aria-label="ปิด" onClick={onClose} type="button">
          ✕
        </button>
        <div className="dhead">
          <div className="dsk" id="d-sk">
            {title}
          </div>
          <div className="dmeta">{subtitle}</div>
        </div>
        <div className="dbody">{children}</div>
      </aside>
    </>
  );
}
