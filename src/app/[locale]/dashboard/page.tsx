import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Eye, Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardOverview({ params }: { params: Promise<{ locale: string }> }) {
  const session = await auth();
  const { locale } = await params;

  if (!session || !session.user || !session.user.phone) {
    redirect(`/${locale}/login`);
  }

  // Fetch the professional linked to the user's phone
  const pro = await db.professional.findFirst({
    where: { whatsapp: session.user.phone },
    include: {
      reviews: true,
    }
  });

  if (!pro) {
    // Handling case where user is PRO role but professional profile doesn't exist yet
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil non trouvé</h2>
        <p className="text-gray-500">Veuillez contacter l'administrateur pour lier votre profil.</p>
      </div>
    );
  }

  const averageRating = pro.reviews.length > 0
    ? (pro.reviews.reduce((acc, rev) => acc + rev.rating, 0) / pro.reviews.length).toFixed(1)
    : "N/A";

  // Mocking views for the MVP (Phase 4)
  const views = Math.floor(Math.random() * 500) + 120;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aperçu</h1>
        <p className="text-gray-500">Bienvenue sur votre tableau de bord, {locale === 'ar' ? pro.nameAr : pro.nameFr}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vues du profil</CardTitle>
            <Eye className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{views}</div>
            <p className="text-xs text-green-500 font-medium mt-1">+12% ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Note Moyenne</CardTitle>
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
            <p className="text-xs text-gray-500 mt-1">Basé sur {pro.reviews.length} avis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Membre depuis</CardTitle>
            <Calendar className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Date(pro.createdAt).getFullYear()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Statut: {pro.status}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}