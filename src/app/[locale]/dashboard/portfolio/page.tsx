import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, ImageIcon } from "lucide-react";

export default async function PortfolioManagement({ params }: { params: Promise<{ locale: string }> }) {
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
        <p className="text-gray-500">Gérez les images de vos réalisations pour attirer plus de clients.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">Cliquez pour uploader</h3>
            <p className="text-gray-500 text-sm mb-6">PNG, JPG, WEBP jusqu'à 5MB</p>
            <Button>Sélectionner un fichier</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vos images (0)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Empty state placeholder */}
          <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-200">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">Aucune image</span>
          </div>
        </div>
      </div>
    </div>
  );
}