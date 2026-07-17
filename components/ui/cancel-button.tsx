"use client";

export function CancelButton({ appointmentId }: { appointmentId: string }) {
  return (
    <button
      type="button"
      className="rounded border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      title={`Cancel appointment ${appointmentId}`}
    >
      Cancel
    </button>
  );
}
