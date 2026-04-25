"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCategoryAction, deleteCategoryAction } from "./actions";
import { toast } from "sonner";

export function UpdateCategoryForm({ cat, locale }: { cat: any; locale: string }) {
  async function handleUpdate(formData: FormData) {
    const result = await updateCategoryAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Catégorie mise à jour avec succès");
    }
  }

  return (
    <form action={handleUpdate} className="flex flex-col gap-2">
      <input type="hidden" name="categoryId" value={cat.id} />
      <Input name="nameFr" defaultValue={cat.nameFr} required className="h-8 text-xs" />
      <Input name="nameAr" defaultValue={cat.nameAr} required dir="rtl" className="h-8 text-xs" />
      <Input name="icon" defaultValue={cat.icon || ""} className="h-8 text-xs" placeholder="Icône" />
      <Button type="submit" size="sm" variant="secondary" className="w-full text-xs">Mettre à jour</Button>
    </form>
  );
}

export function DeleteCategoryForm({ cat, locale }: { cat: any; locale: string }) {
  async function handleDelete(formData: FormData) {
    const result = await deleteCategoryAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Catégorie supprimée avec succès");
    }
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="categoryId" value={cat.id} />
      <Button type="submit" size="sm" variant="destructive" disabled={cat._count.professionals > 0}>
        Supprimer
      </Button>
    </form>
  );
}