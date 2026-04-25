import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { UploadForm } from "./UploadForm";

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
          <UploadForm locale={locale} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vos images ({pro.images.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pro.images.length > 0 ? (
            pro.images.map((imgUrl, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={imgUrl} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-200">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">Aucune image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}