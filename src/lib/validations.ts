import { z } from "zod";

const phoneRegex = /^(0[67]\d{8}|(\+212)[67]\d{8})$/;

export const joinSchema = z.object({
  phone: z.string().regex(phoneRegex, { message: "Numéro de téléphone invalide. Utilisez le format 06/07 ou +2126/7." }),
  nameFr: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  nameAr: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  whatsapp: z.string().regex(phoneRegex, { message: "Numéro WhatsApp invalide." }),
  categoryId: z.string().min(1, { message: "Veuillez sélectionner une catégorie." }),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  proId: z.string().min(1, { message: "L'identifiant du professionnel est requis." }),
});

export type JoinFormValues = z.infer<typeof joinSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
