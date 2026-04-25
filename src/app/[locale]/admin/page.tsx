import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApproveProForm, RejectProForm } from "./ModerationForms";

export default async function ModerationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const professionals = await db.professional.findMany({
    include: {
      category: true,
    },
    orderBy: [
      { status: 'asc' }, // PENDING comes before APPROVED
      { createdAt: 'desc' }
    ]
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modération des Professionnels</h1>
        <p className="text-gray-500">Gérez les inscriptions et validez les profils pour qu'ils soient publics.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Professionnels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Nom (Fr)</th>
                  <th className="px-6 py-4">Nom (Ar)</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {professionals.length > 0 ? (
                  professionals.map((pro) => (
                    <tr key={pro.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{pro.nameFr}</td>
                      <td className="px-6 py-4 text-gray-700">{pro.nameAr}</td>
                      <td className="px-6 py-4 text-gray-500">{pro.category.nameFr}</td>
                      <td className="px-6 py-4 text-gray-500">{pro.whatsapp}</td>
                      <td className="px-6 py-4">
                        <Badge variant={pro.status === 'APPROVED' ? 'success' : 'warning'}>
                          {pro.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <div className="flex items-center justify-end gap-2">
                          {pro.status === 'PENDING' && (
                            <ApproveProForm proId={pro.id} locale={locale} />
                          )}
                          <RejectProForm pro={pro} locale={locale} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun professionnel trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}