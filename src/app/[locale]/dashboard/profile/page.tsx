import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./ProfileForm";

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
          <ProfileForm pro={pro} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}