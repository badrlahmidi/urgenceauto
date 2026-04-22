"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCircle, ImageIcon, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: `/${locale}/dashboard`, label: "Aperçu", icon: LayoutDashboard },
    { href: `/${locale}/dashboard/profile`, label: "Profil", icon: UserCircle },
    { href: `/${locale}/dashboard/portfolio`, label: "Portfolio", icon: ImageIcon },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-gray-200">
        <span className="font-bold text-xl text-blue-600">Urgence Auto PRO</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white w-full md:w-64 border-e border-gray-200 flex-shrink-0 flex-col transition-all duration-300 md:flex",
        isOpen ? "flex" : "hidden"
      )}>
        <div className="p-6 hidden md:block">
          <span className="font-bold text-2xl text-blue-600 tracking-tight">PRO Dashboard</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}