import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
          <SettingsForm settings={settings} locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}