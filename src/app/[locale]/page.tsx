import { useTranslations } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("Index");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      {/* SearchBar Placeholder */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-4 flex flex-col md:flex-row gap-4 border border-gray-200">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          {t("searchButton")}
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {/* Category placeholders */}
        <div className="p-6 bg-gray-50 rounded-xl border flex flex-col items-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl">🔧</div>
          <h3 className="text-xl font-semibold">{t("mechanic")}</h3>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl border flex flex-col items-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl">⚡</div>
          <h3 className="text-xl font-semibold">{t("electrician")}</h3>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl border flex flex-col items-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-2xl">🚜</div>
          <h3 className="text-xl font-semibold">{t("towing")}</h3>
        </div>
      </div>
    </main>
  );
}
