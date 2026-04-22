"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Tags, MessageSquareWarning, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: `/${locale}/admin`, label: "Modération", icon: Users },
    { href: `/${locale}/admin/categories`, label: "Catégories", icon: Tags },
    { href: `/${locale}/admin/reviews`, label: "Avis", icon: MessageSquareWarning },
    { href: `/${locale}/admin/settings`, label: "Paramètres", icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 border-b border-slate-800">
        <span className="font-bold text-xl">Admin Panel</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={cn(
        "bg-slate-900 text-slate-300 w-full md:w-64 flex-shrink-0 flex-col transition-all duration-300 md:flex",
        isOpen ? "flex" : "hidden"
      )}>
        <div className="p-6 hidden md:block border-b border-slate-800">
          <span className="font-bold text-2xl text-white tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
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
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}