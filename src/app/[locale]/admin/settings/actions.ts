"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const heroTitleFr = formData.get("heroTitleFr") as string;
  const heroTitleAr = formData.get("heroTitleAr") as string;
  const heroSubFr = formData.get("heroSubFr") as string;
  const heroSubAr = formData.get("heroSubAr") as string;
  const contactEmail = formData.get("contactEmail") as string | null;
  const contactPhone = formData.get("contactPhone") as string | null;

  if (!heroTitleFr || !heroTitleAr || !heroSubFr || !heroSubAr) {
    return { error: "Missing required fields" };
  }

  try {
    await db.siteSettings.upsert({
      where: { id: "global" },
      update: {
        heroTitleFr,
        heroTitleAr,
        heroSubFr,
        heroSubAr,
        contactEmail,
        contactPhone,
      },
      create: {
        id: "global",
        heroTitleFr,
        heroTitleAr,
        heroSubFr,
        heroSubAr,
        contactEmail,
        contactPhone,
      }
    });
    revalidatePath(`/${locale}/admin/settings`);
    revalidatePath(`/${locale}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
}
