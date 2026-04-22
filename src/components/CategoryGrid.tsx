"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Wrench, Zap, Truck, PaintRoller, ThermometerSnowflake, Activity, Circle, Droplet, Package, Sparkles } from "lucide-react";
import type { Category } from "@prisma/client";

// Simple mapping for Lucide icons based on the seed
const IconMap: Record<string, React.ElementType> = {
  Wrench,
  Zap,
  Truck,
  PaintRoller,
  ThermometerSnowflake,
  Activity,
  Circle,
  Droplet,
  Package,
  Sparkles,
};

export function CategoryGrid({ categories, locale }: { categories: Category[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {categories.map((category) => {
        const IconComponent = category.icon ? IconMap[category.icon] || Wrench : Wrench;
        return (
          <Link
            key={category.id}
            href={`/${locale}/category/${category.slug}`}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <IconComponent className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm md:text-base">
              {locale === 'ar' ? category.nameAr : category.nameFr}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}