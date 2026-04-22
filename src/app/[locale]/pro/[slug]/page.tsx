import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Star, PhoneCall, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const t = await getTranslations("ProProfile");
  const { locale, slug } = await params;

  const pro = await db.professional.findUnique({
    where: {
      slug,
      status: "APPROVED"
    },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!pro) {
    notFound();
  }

  const name = locale === 'ar' ? pro.nameAr : pro.nameFr;
  const categoryName = locale === 'ar' ? pro.category.nameAr : pro.category.nameFr;

  const averageRating = pro.reviews.length > 0
    ? (pro.reviews.reduce((acc, rev) => acc + rev.rating, 0) / pro.reviews.length).toFixed(1)
    : "N/A";

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-600 h-48 w-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-4 border-white shadow-md flex-shrink-0">
               <span className="text-4xl font-bold">{name.charAt(0).toUpperCase()}</span>
            </div>

            <div className="flex-grow text-center md:text-start w-full">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                    {name}
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </h1>
                  <p className="text-xl text-gray-600">{categoryName}</p>
                </div>

                <div className="mt-4 md:mt-0 flex items-center bg-yellow-50 px-4 py-2 rounded-xl">
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-xl text-gray-900 ms-2">{averageRating}</span>
                  <span className="text-gray-500 text-sm ms-2">({pro.reviews.length} {t("reviews")})</span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-8">
                <MapPin className="w-5 h-5" />
                <span>Marrakech, Maroc</span>
              </div>

              {/* Main Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button asChild variant="success" size="lg" className="flex-1 text-lg rounded-2xl h-16 shadow-md hover:-translate-y-1 transition-transform">
                  <a href={`https://wa.me/${pro.whatsapp.startsWith('0') ? '212' + pro.whatsapp.slice(1) : pro.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-6 h-6 me-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 text-lg rounded-2xl h-16 border-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                  <a href={`tel:${pro.whatsapp}`}>
                    <PhoneCall className="w-6 h-6 me-2" />
                    {t("call")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("reviewsTitle")}</h2>

          <div className="space-y-6">
            {pro.reviews.length > 0 ? (
              pro.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 italic">"{review.comment}"</p>
                  )}
                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(review.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'fr-FR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">{t("noReviews")}</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}