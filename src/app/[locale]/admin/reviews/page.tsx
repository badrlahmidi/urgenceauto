import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export default async function ReviewsModerationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  async function deleteReview(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const reviewId = formData.get("reviewId") as string;
    if (reviewId) {
      await db.review.delete({
        where: { id: reviewId }
      });
      revalidatePath(`/${locale}/admin/reviews`);
    }
  }

  const reviews = await db.review.findMany({
    include: {
      pro: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modération des Avis</h1>
        <p className="text-gray-500">Consultez et supprimez les avis inappropriés ou frauduleux.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Avis Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Professionnel</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Commentaire</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr key={review.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {review.pro.nameFr}
                        <br/>
                        <span className="text-xs text-gray-400 font-normal">{review.pro.whatsapp}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-md truncate">
                        {review.comment || <span className="italic text-gray-400">Aucun commentaire</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <div className="flex items-center justify-end">
                          <form action={deleteReview}>
                            <input type="hidden" name="reviewId" value={review.id} />
                            <Button type="submit" size="sm" variant="destructive">Supprimer</Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Aucun avis trouvé.
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