import { z } from "zod";

export const bookZodSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: z.string().min(1, "ISBN is required"),
    description: z.string().optional(),
    copies: z.number().int().nonnegative("Copies must be a non-negative integer"),
    available: z.boolean().optional().default(true)
});