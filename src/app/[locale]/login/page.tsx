"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const t = useTranslations("Index"); // We can use generic translations for now or add specific ones
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "PRO_NOT_APPROVED") {
        setError("Votre compte est en cours de validation par l'administration.");
      } else {
        setError("Identifiants incorrects.");
      }
      setLoading(false);
    } else {
      router.push(`/${params.locale}/dashboard`);
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Connexion Pro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0600000000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Vous n'avez pas de compte ?{" "}
            <Link href={`/${params.locale}/register`} className="text-blue-600 font-semibold hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}