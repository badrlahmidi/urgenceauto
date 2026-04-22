import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ProfileManagement({ params }: { params: Promise<{ locale: string }> }) {
  const session = await auth();
  const { locale } = await params;

  if (!session || !session.user || !session.user.phone) {
    redirect(`/${locale}/login`);
  }

  const pro = await db.professional.findFirst({
    where: { whatsapp: session.user.phone },
  });

  if (!pro) {
    redirect(`/${locale}/dashboard`);
  }

  // Server action to update profile
  async function updateProfile(formData: FormData) {
    "use server";
    const nameFr = formData.get("nameFr") as string;
    const nameAr = formData.get("nameAr") as string;

    if (pro) {
      await db.professional.update({
        where: { id: pro.id },
        data: {
          nameFr,
          nameAr,
        }
      });
      revalidatePath(`/${locale}/dashboard/profile`);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-500">Mettez à jour vos informations publiques.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">

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
        </CardContent>
      </Card>
    </div>
  );
}