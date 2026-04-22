import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      <AdminSidebar locale={locale} />
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}