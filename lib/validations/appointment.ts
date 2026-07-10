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
