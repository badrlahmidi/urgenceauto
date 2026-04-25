"use client";

import { Button } from "@/components/ui/button";
import { deleteReviewAction } from "./actions";
import { toast } from "sonner";

export function DeleteReviewForm({ reviewId, locale }: { reviewId: string; locale: string }) {
  async function handleDelete(formData: FormData) {
    const result = await deleteReviewAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Avis supprimé avec succès");
    }
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="reviewId" value={reviewId} />
      <Button type="submit" size="sm" variant="destructive">Supprimer</Button>
    </form>
  );
}
