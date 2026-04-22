import { useTranslations } from "next-intl";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const t = useTranslations("Category");
  const { locale, slug } = await params;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link href={`/${locale}`} className="text-blue-600 hover:underline mb-8 inline-block ms-auto me-0">
          &larr; {t("back")}
        </Link>

        <h1 className="text-3xl font-bold mb-8 capitalize">{slug}</h1>

        <div className="grid grid-cols-1 gap-6">
          {/* ProfessionalCard Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0"></div>

            <div className="flex-grow text-center md:text-start">
              <h2 className="text-xl font-bold">Garage Mohammed</h2>
              <p className="text-gray-500 mb-2">Marrakech - Gueliz</p>
              <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-500">
                ★ 4.8 <span className="text-gray-400 text-sm ms-1">(12 avis)</span>
              </div>
            </div>

            {/* Central WhatsApp Button - Important for Marrakech context */}
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full md:w-auto justify-center"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
