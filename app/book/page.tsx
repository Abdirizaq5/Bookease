"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { bookingSchema, BookingInput } from "@/lib/validations/appointment";

export default function BookPage() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
  });

  async function onSubmit(data: BookingInput) {
    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("Booking confirmed! ✅");
      reset();
    } else {
      setMessage(result.error);
    }
  }

  return (
    <div>
      <h1>Book an Appointment</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="datetime-local"
          {...register("date")}
        />

        {errors.date && <p>{errors.date.message}</p>}

        <textarea
          {...register("notes")}
        />

        {errors.notes && <p>{errors.notes.message}</p>}

        <button type="submit">
          Book Appointment
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}







// export default function BookPage() {
//   return (
//     <main className="p-10">
//       <h1 className="text-3xl font-bold">Book an Appointment</h1>

//       <form className="mt-6 space-y-4">
//         <input
//           className="border p-2 w-full"
//           placeholder="First Name"
//         />

//         <input
//           className="border p-2 w-full"
//           placeholder="Last Name"
//         />

//         <input
//           type="email"
//           className="border p-2 w-full"
//           placeholder="Email"
//         />

//         <input
//           type="datetime-local"
//           className="border p-2 w-full"
//         />

//         <button className="bg-blue-600 text-white px-4 py-2 rounded">
//           Book Appointment
//         </button>
//       </form>
//     </main>
//   );
// }
