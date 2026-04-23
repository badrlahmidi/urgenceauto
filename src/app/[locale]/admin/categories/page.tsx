import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export default async function CategoriesModerationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  async function createCategory(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const slug = formData.get("slug") as string;
    const nameFr = formData.get("nameFr") as string;
    const nameAr = formData.get("nameAr") as string;
    const icon = formData.get("icon") as string;

    if (slug && nameFr && nameAr) {
      try {
        await db.category.create({
          data: { slug, nameFr, nameAr, icon }
        });
        revalidatePath(`/${locale}/admin/categories`);
      } catch (error: any) {
        if (error?.code === 'P2002') {
          // Unique constraint violation
          throw new Error(`Category with slug "${slug}" already exists.`);
        }
        throw error;
      }
    }
  }

  async function updateCategory(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const categoryId = formData.get("categoryId") as string;
    const nameFr = formData.get("nameFr") as string;
    const nameAr = formData.get("nameAr") as string;
    const icon = formData.get("icon") as string;

    if (categoryId && nameFr && nameAr) {
      await db.category.update({
        where: { id: categoryId },
        data: { nameFr, nameAr, icon }
      });
      revalidatePath(`/${locale}/admin/categories`);
    }
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const categoryId = formData.get("categoryId") as string;
    if (categoryId) {
      await db.category.delete({
        where: { id: categoryId }
      });
      revalidatePath(`/${locale}/admin/categories`);
    }
  }

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
            <form action={createCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant (Slug)</label>
                <Input name="slug" placeholder="ex: vitrage-auto" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Français)</label>
                <Input name="nameFr" placeholder="ex: Vitrage Auto" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Arabe)</label>
                <Input name="nameAr" placeholder="ex: زجاج السيارات" required dir="rtl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône (Lucide React)</label>
                <Input name="icon" placeholder="ex: Car" />
              </div>
              <Button type="submit" className="w-full">Ajouter</Button>
            </form>
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
                          <form action={updateCategory} className="flex flex-col gap-2">
                            <input type="hidden" name="categoryId" value={cat.id} />
                            <Input name="nameFr" defaultValue={cat.nameFr} required className="h-8 text-xs" />
                            <Input name="nameAr" defaultValue={cat.nameAr} required dir="rtl" className="h-8 text-xs" />
                            <Input name="icon" defaultValue={cat.icon || ""} className="h-8 text-xs" placeholder="Icône" />
                            <Button type="submit" size="sm" variant="secondary" className="w-full text-xs">Mettre à jour</Button>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-blue-600">
                          {cat._count.professionals}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <div className="flex items-center justify-end">
                            <form action={deleteCategory}>
                              <input type="hidden" name="categoryId" value={cat.id} />
                              <Button type="submit" size="sm" variant="destructive" disabled={cat._count.professionals > 0}>
                                Supprimer
                              </Button>
                            </form>
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