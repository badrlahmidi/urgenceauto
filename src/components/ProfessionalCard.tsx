"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Star, PhoneCall, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProfessionalWithReviews = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  whatsapp: string;
  reviews: { rating: number }[];
};

export function ProfessionalCard({ pro, locale }: { pro: ProfessionalWithReviews; locale: string }) {
  const t = useTranslations("ProCard");

  const name = locale === 'ar' ? pro.nameAr : pro.nameFr;

  // Calculate average rating safely
  const averageRating = pro.reviews.length > 0
    ? (pro.reviews.reduce((acc, rev) => acc + rev.rating, 0) / pro.reviews.length).toFixed(1)
    : "N/A";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start hover:shadow-md transition-shadow">
      {/* Avatar Placeholder */}
      <div className="w-24 h-24 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 border border-gray-200">
        <span className="text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
      </div>

      <div className="flex-grow text-center md:text-start w-full">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 mb-2">
          <Link href={`/${locale}/pro/${pro.slug}`} className="hover:text-blue-600 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          </Link>
          <Badge variant="outline" className="text-gray-500 font-normal">
            Marrakech
          </Badge>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-500 mb-6">
          <Star className="w-5 h-5 fill-current" />
          <span className="font-bold text-gray-800 ms-1">{averageRating}</span>
          <span className="text-gray-400 text-sm ms-1">({pro.reviews.length} {t("reviews")})</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button asChild variant="success" className="w-full sm:w-auto shadow-md rounded-xl font-bold py-6 px-8 hover:-translate-y-0.5 transition-transform">
            <a href={`https://wa.me/${pro.whatsapp.startsWith('0') ? '212' + pro.whatsapp.slice(1) : pro.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 me-2" />
              WhatsApp
            </a>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto rounded-xl py-6 px-8 text-blue-600 border-blue-200 hover:bg-blue-50">
            <a href={`tel:${pro.whatsapp}`}>
              <PhoneCall className="w-5 h-5 me-2" />
              {t("call")}
            </a>
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto rounded-xl py-6 px-6 sm:ms-auto">
            <Link href={`/${locale}/pro/${pro.slug}`}>
              {t("viewProfile")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}