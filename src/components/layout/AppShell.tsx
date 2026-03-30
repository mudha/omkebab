"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, Menu, X, LayoutDashboard, ShoppingCart, Package, ClipboardList, Store, Users, MapPin } from "lucide-react";
import { User } from "@/types";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
  title?: string;
}

const adminNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transaksi", label: "Riwayat Transaksi", icon: ClipboardList },
  { href: "/produk", label: "Manajemen Produk", icon: Package },
  { href: "/metode-penjualan", label: "Metode Penjualan", icon: MapPin },
  { href: "/pengguna", label: "Manajemen Pengguna", icon: Users },
  { href: "/cabang", label: "Manajemen Cabang", icon: Store },
  { href: "/penjualan", label: "Input Penjualan", icon: ShoppingCart }, // Admin juga bisa input
];

const employeeNav = [
  { href: "/penjualan", label: "Input Penjualan", icon: ShoppingCart },
];

export default function AppShell({ user, children, title }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const navItems = user.role === "ADMIN" ? adminNav : employeeNav;

  // Tutup sidebar otomatis kalau pindah halaman di mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100/80">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <span className="text-white font-black text-lg tracking-tight">OK</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-gray-900 text-lg leading-tight truncate">Om Kebab</h2>
            <p className="text-[13px] font-medium text-gray-400">Kasir Pintar</p>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="px-6 py-5 mx-4 mt-6 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center shrink-0">
            <span className="text-orange-500 font-bold text-base">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-xs font-semibold text-orange-600">{user.role === "ADMIN" ? "Administrator" : "Karyawan"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-orange-500" : "text-gray-400"} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 group w-full px-4 py-4 rounded-2xl text-red-500 bg-red-50/50 hover:bg-red-100 border border-transparent hover:border-red-100 transition-all font-bold text-[15px]"
          >
            <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3 lg:px-8 lg:py-5 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-gray-900 text-xl lg:text-2xl truncate">{title}</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in relative">
          {children}
        </main>
      </div>
    </div>
  );
}