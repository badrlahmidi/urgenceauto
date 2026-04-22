import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const t = await getTranslations("Category");
  const { locale, slug } = await params;

  const category = await db.category.findUnique({
    where: { slug }
  });

  if (!category) {
    notFound();
  }

  const professionals = await db.professional.findMany({
    where: {
      categoryId: category.id,
      status: "APPROVED"
    },
    include: {
      reviews: {
        select: { rating: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link href={`/${locale}`} className="text-blue-600 hover:underline mb-8 inline-block ms-auto me-0 font-medium">
          &larr; {t("back")}
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {locale === 'ar' ? category.nameAr : category.nameFr}
          </h1>
          <p className="text-gray-500 text-lg">
            {professionals.length} professionnel(s) disponible(s) à Marrakech
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {professionals.length > 0 ? (
            professionals.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} locale={locale} />
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">Aucun professionnel trouvé dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
