"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation"; // or next-intl/navigation

export function SearchBar({ locale }: { locale: string }) {
  const t = useTranslations("Index");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Very basic implementation: redirect to a generic search or category if exact match.
      // In a real app, this would route to a /search?q=query page.
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
      <div className="relative flex-grow flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 rtl:right-4 rtl:left-auto" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-12 rtl:pr-12 rtl:pl-3 h-14 text-lg border-none focus-visible:ring-0 shadow-none bg-transparent"
        />
      </div>
      <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl shrink-0">
        {t("searchButton")}
      </Button>
    </form>
  );
}