"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminActions({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function update(newStatus: "CONFIRMED" | "CANCELLED") {
        setLoading(true);

        const res = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        setLoading(false);

        if (!res.ok) {
            alert("Could not update the appointment.");
            return;
        }

        router.refresh();
    }
    return (
        <div className="flex gap-3">
            {status !== "CONFIRMED" && (
                <button
                    onClick={() => update("CONFIRMED")}
                    disabled={loading}
                    className="text-sm font-medium text-green-700 hover:underline disabled:opacity-50"
                >
                    Confirm
                </button>
            )}

            {status !== "CANCELLED" && (
                <button
                    onClick={() => update("CANCELLED")}
                    disabled={loading}
                    className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                    Cancel
                </button>
            )}
        </div>
    );
}