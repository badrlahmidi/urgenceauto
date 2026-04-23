import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  async function updateSettings(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const heroTitleFr = formData.get("heroTitleFr") as string;
    const heroTitleAr = formData.get("heroTitleAr") as string;
    const heroSubFr = formData.get("heroSubFr") as string;
    const heroSubAr = formData.get("heroSubAr") as string;
    const contactEmail = formData.get("contactEmail") as string | null;
    const contactPhone = formData.get("contactPhone") as string | null;

    if (heroTitleFr && heroTitleAr && heroSubFr && heroSubAr) {
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
    }
  }

  // Fetch settings or create defaults if they don't exist
  let settings = await db.siteSettings.findUnique({
    where: { id: "global" }
  });

  if (!settings) {
    settings = await db.siteSettings.create({
      data: {
        id: "global"
      }
    });
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du Site</h1>
        <p className="text-gray-500">Gérez les textes publics et les informations de contact de la plateforme.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Textes de la Page d'Accueil (Hero Section)</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
}