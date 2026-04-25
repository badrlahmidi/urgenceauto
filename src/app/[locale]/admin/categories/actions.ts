"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const slug = formData.get("slug") as string;
  const nameFr = formData.get("nameFr") as string;
  const nameAr = formData.get("nameAr") as string;
  const icon = formData.get("icon") as string;

  if (!slug || !nameFr || !nameAr) {
     return { error: "Missing required fields" }
  }

  try {
    await db.category.create({
      data: { slug, nameFr, nameAr, icon }
    });
    revalidatePath(`/${locale}/admin/categories`);
    return { success: true };
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return { error: `Category with slug "${slug}" already exists.` };
    }
    return { error: "Failed to create category" };
  }
}

export async function updateCategoryAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const categoryId = formData.get("categoryId") as string;
  const nameFr = formData.get("nameFr") as string;
  const nameAr = formData.get("nameAr") as string;
  const icon = formData.get("icon") as string;

  if (!categoryId || !nameFr || !nameAr) {
     return { error: "Missing required fields" }
  }

  try {
    await db.category.update({
      where: { id: categoryId },
      data: { nameFr, nameAr, icon }
    });
    revalidatePath(`/${locale}/admin/categories`);
    return { success: true };
  } catch (error) {
     return { error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const categoryId = formData.get("categoryId") as string;
  if (!categoryId) {
     return { error: "Missing categoryId" }
  }

  try {
    await db.category.delete({
      where: { id: categoryId }
    });
    revalidatePath(`/${locale}/admin/categories`);
    return { success: true };
  } catch (error) {
     return { error: "Failed to delete category" };
  }
}
