"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { joinSchema } from "@/lib/validations";
import { z } from "zod";

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    const validatedData = joinSchema.parse({
      phone: data.phone,
      whatsapp: data.phone, // mapping phone to whatsapp natively for this version
      nameFr: data.nameFr,
      nameAr: data.nameAr,
      categoryId: data.categoryId,
    });

    const password = data.password as string;
    if (!password || password.length < 6) {
      return { error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone: validatedData.phone }
    });

    if (existingUser) {
      return { error: "Ce numéro de téléphone est déjà utilisé." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User and Professional profile within a transaction
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: validatedData.phone,
          passwordHash,
          role: "PRO",
        }
      });

      // Generate a basic slug
      const baseSlug = validatedData.nameFr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      await tx.professional.create({
        data: {
          nameFr: validatedData.nameFr,
          nameAr: validatedData.nameAr,
          whatsapp: validatedData.phone,
          slug: uniqueSlug,
          categoryId: validatedData.categoryId,
          status: "PENDING",
        }
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || "Erreur de validation" };
    }
    return { error: "Une erreur interne est survenue. Veuillez réessayer." };
  }
}