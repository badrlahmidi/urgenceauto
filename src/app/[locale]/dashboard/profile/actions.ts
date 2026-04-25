"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData, locale: string) {
  const sessionAction = await auth();
  if (!sessionAction || sessionAction.user.role !== "PRO") {
    return { error: "Unauthorized" };
  }

  const nameFr = formData.get("nameFr") as string;
  const nameAr = formData.get("nameAr") as string;
  const proId = formData.get("proId") as string;

  try {
    await db.professional.update({
      where: { id: proId },
      data: {
        nameFr,
        nameAr,
      }
    });
    revalidatePath(`/${locale}/dashboard/profile`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}
