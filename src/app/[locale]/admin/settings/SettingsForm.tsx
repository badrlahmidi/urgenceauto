"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "./actions";
import { toast } from "sonner";

export function SettingsForm({ settings, locale }: { settings: any; locale: string }) {
  async function handleUpdate(formData: FormData) {
    const result = await updateSettingsAction(formData, locale);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Paramètres mis à jour avec succès");
    }
  }

  return (
    <form action={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* French Settings */}
        <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Français (LTR)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
            <Input name="heroTitleFr" defaultValue={settings.heroTitleFr} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
            <textarea
              name="heroSubFr"
              defaultValue={settings.heroSubFr}
              required
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* Arabic Settings */}
        <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Arabe (RTL)</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
            <Input name="heroTitleAr" defaultValue={settings.heroTitleAr} required dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
            <textarea
              name="heroSubAr"
              defaultValue={settings.heroSubAr}
              required
              dir="rtl"
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Informations de Contact Globales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contact</label>
            <Input name="contactEmail" type="email" defaultValue={settings.contactEmail || ''} placeholder="contact@urgenceauto.ma" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone de Support</label>
            <Input name="contactPhone" type="tel" defaultValue={settings.contactPhone || ''} placeholder="+212600000000" />
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto mt-6">
        Sauvegarder les paramètres
      </Button>
    </form>
  );
}
