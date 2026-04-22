import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/SearchBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { db } from "@/lib/db";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const categories = await db.category.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-24 pb-12 px-4 md:px-8 bg-gray-50">

      {/* Hero Section */}
      <section className="w-full max-w-5xl flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
          Urgence Auto <span className="text-blue-600">Marrakech</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Trouvez instantanément les meilleurs professionnels de l'automobile autour de vous. Dépannage, mécanique, carrosserie, et plus encore.
        </p>

        <SearchBar locale={locale} />
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-6xl mt-8">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
        </div>
        <CategoryGrid categories={categories} locale={locale} />
      </section>

    </main>
  );
}
