"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelButton({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this appointment?")) return;

  setLoading(true);

  const res = await fetch(`/api/appointments/${appointmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "CANCELLED",
    }),
  });

  setLoading(false);

  if (!res.ok) {
    alert("Sorry, we couldn't cancel that. Please try again.");
    return;
  }

  router.refresh();
  }

  return (
    <button
    onClick={handleCancel}
    disabled={loading}
    className="text-sm text-red-600 hover:underline disabled:opacity-50"
>
  {loading ? "Cancelling…" : "Cancel"}
    </button>
  );
}











// export function CancelButton({ appointmentId }: { appointmentId: string }) {
//   return (
//     <button
//       type="button"
//       className="rounded border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
//       title={`Cancel appointment ${appointmentId}`}
//     >
//       Cancel
//     </button>
//   );
// }
