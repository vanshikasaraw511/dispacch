'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Truck, Navigation, CreditCard, User, LogOut, LogIn } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('dispacch_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        setUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('dispacch_user');
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Optimizer', href: '/', icon: Truck },
    { name: 'Track Shipments', href: '/tracking', icon: Navigation },
    { name: 'Payments & Balance', href: '/payments', icon: CreditCard },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50 px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3.5 group">
        <div className="relative group flex items-center justify-center">
          <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur group-hover:bg-emerald-500/35 transition"></div>
          <Logo size={42} className="relative transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            DISPACCH <span className="text-cyan-400 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 ml-1">LOGISTICS</span>
          </h1>
          <p className="text-[11px] text-slate-400">Smart Freight Management</p>
        </div>
      </Link>

      {/* Nav items */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Auth Status */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="flex items-center gap-2.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl hover:border-slate-700 transition">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="text-left text-xs hidden sm:block">
                <p className="font-semibold text-slate-200 leading-tight">{user.companyName || user.fullName}</p>
                <p className="text-[10px] text-slate-400 font-mono">₹{user.walletBalance ?? '24,500'}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-2 rounded-xl border border-slate-800 hover:border-rose-500/30 bg-slate-950/60 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login / Register
          </Link>
        )}
      </div>
    </header>
  );
}