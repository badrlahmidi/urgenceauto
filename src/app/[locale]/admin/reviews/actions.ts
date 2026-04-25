"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteReviewAction(formData: FormData, locale: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const reviewId = formData.get("reviewId") as string;
  if (!reviewId) {
     return { error: "Missing reviewId" };
  }

  try {
    await db.review.delete({
      where: { id: reviewId }
    });
    revalidatePath(`/${locale}/admin/reviews`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete review" };
  }
}
