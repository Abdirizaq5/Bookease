import { z } from "zod";

export const bookingSchema = z.object({
  date: z
    .string()
    .min(1, "Please choose a date and time")
    .refine((value) => new Date(value) > new Date(), {
        message: "The appointment must be in the future",
    }),

  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});



export type BookingInput = z.infer<typeof bookingSchema>;


export const updateAppointmentSchema = z
  .object({
    status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
    date: z
      .string()
      .refine((value) => new Date(value) > new Date(), {
        message: "The new date must be in the future",
      })
      .optional(),
  })
  .refine((data) => data.status !== undefined || data.date !== undefined, {
    message: "Provide a new status or a new date to update",
  });


export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
