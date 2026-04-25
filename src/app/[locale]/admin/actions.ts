"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveProAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const proId = formData.get("proId") as string;
  if (!proId) return { error: "Missing proId" };

  try {
    await db.professional.update({
      where: { id: proId },
      data: { status: "APPROVED" }
    });
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to approve pro" };
  }
}

export async function rejectProAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const proId = formData.get("proId") as string;
  if (!proId) return { error: "Missing proId" };

  try {
    await db.professional.delete({
      where: { id: proId }
    });
    revalidatePath(`/${locale}/admin`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to reject pro" };
  }
}
