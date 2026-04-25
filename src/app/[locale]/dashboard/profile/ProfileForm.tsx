"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "./actions";
import { toast } from "sonner";

export function ProfileForm({ pro, locale }: { pro: any; locale: string }) {
  async function handleSubmit(formData: FormData) {
    const result = await updateProfileAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profil mis à jour avec succès");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="proId" value={pro.id} />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Français)</label>
          <Input name="nameFr" defaultValue={pro.nameFr} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Arabe)</label>
          <Input name="nameAr" defaultValue={pro.nameAr} required dir="rtl" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
          <Input defaultValue={pro.whatsapp} disabled className="bg-gray-50" />
          <p className="text-xs text-gray-500 mt-1">Contactez l'administration pour modifier votre numéro.</p>
        </div>
      </div>

      <Button type="submit" size="lg">Enregistrer les modifications</Button>
    </form>
  );
}