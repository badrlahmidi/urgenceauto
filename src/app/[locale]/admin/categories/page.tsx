import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { UpdateCategoryForm, DeleteCategoryForm } from "./CategoryActionsForms";

export default async function CategoriesModerationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;


  const categories = await db.category.findMany({
    include: {
      _count: {
        select: { professionals: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Catégories</h1>
        <p className="text-gray-500">Ajoutez, modifiez ou supprimez les types de métiers disponibles sur la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form to create a new category */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Nouvelle Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCategoryForm locale={locale} />
          </CardContent>
        </Card>

        {/* List of categories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Catégories Existantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Slug / Icône</th>
                    <th className="px-6 py-4">Noms</th>
                    <th className="px-6 py-4 text-center">Pros Associés</th>
                    <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{cat.slug}</span>
                          <br/>
                          <span className="text-xs text-gray-500">{cat.icon || 'Aucune icône'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <UpdateCategoryForm cat={cat} locale={locale} />
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">
                          {cat._count.professionals}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <div className="flex items-center justify-end">
                            <DeleteCategoryForm cat={cat} locale={locale} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Aucune catégorie trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}