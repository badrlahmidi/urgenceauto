"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoryAction } from "./actions";
import { toast } from "sonner";
import { useRef } from "react";

export function CreateCategoryForm({ locale }: { locale: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createCategoryAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Catégorie créée avec succès");
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant (Slug)</label>
        <Input name="slug" placeholder="ex: vitrage-auto" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Français)</label>
        <Input name="nameFr" placeholder="ex: Vitrage Auto" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Arabe)</label>
        <Input name="nameAr" placeholder="ex: زجاج السيارات" required dir="rtl" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icône (Lucide React)</label>
        <Input name="icon" placeholder="ex: Car" />
      </div>
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
}