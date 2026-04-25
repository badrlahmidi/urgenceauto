"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerAction } from "./actions";
import type { Category } from "@prisma/client";

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories).catch(console.error);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md text-center p-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie</h2>
          <p className="text-gray-600 mb-6">Votre profil est en cours d'examen. Vous pourrez vous connecter une fois approuvé par l'administration.</p>
          <Button asChild className="w-full">
            <Link href={`/${params.locale}/login`}>Retour à la connexion</Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Devenir Partenaire</CardTitle>
          <p className="text-gray-500 mt-2">Rejoignez le réseau Urgence Auto Marrakech</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du garage (Fr)</label>
                <Input name="nameFr" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du garage (Ar)</label>
                <Input name="nameAr" required dir="rtl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone / WhatsApp</label>
              <Input name="phone" type="tel" placeholder="0600000000 ou +212600000000" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <Input name="password" type="password" required minLength={6} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie principale</label>
              <select name="categoryId" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <option value="">Sélectionnez un métier</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nameFr} - {c.nameAr}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={loading}>
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Déjà inscrit ?{" "}
            <Link href={`/${params.locale}/login`} className="text-blue-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}