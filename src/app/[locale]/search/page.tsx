import { db } from "@/lib/db";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { SearchBar } from "@/components/SearchBar";

export default async function SearchResultsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = q || "";

  // Perform a basic search across nameFr, nameAr, or category names
  const professionals = await db.professional.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { nameFr: { contains: query, mode: "insensitive" } },
        { nameAr: { contains: query } },
        { category: { nameFr: { contains: query, mode: "insensitive" } } },
        { category: { nameAr: { contains: query } } },
      ]
    },
    include: {
      category: true,
      reviews: {
        select: { rating: true }
      }
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center mb-12">
        <SearchBar locale={locale} />
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Résultats pour : <span className="text-blue-600">"{query}"</span>
        </h1>

        <p className="text-gray-500 mb-8">{professionals.length} professionnel(s) trouvé(s)</p>

        <div className="grid grid-cols-1 gap-6">
          {professionals.length > 0 ? (
            professionals.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} locale={locale} />
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">Aucun professionnel ne correspond à votre recherche.</p>
              <p className="text-gray-400 text-sm">Essayez d'autres mots-clés comme "Mécanique" ou "Dépannage".</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}