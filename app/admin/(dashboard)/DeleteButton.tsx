"use client";

export default function DeleteButton({
  action,
  confirmText,
}: {
  action: () => Promise<void>;
  confirmText: string;
}) {
  return (
    <button
      type="button"
      className="admin-btn danger"
      onClick={() => {
        if (confirm(confirmText)) action();
      }}
    >
      ลบ
    </button>
  );
}
