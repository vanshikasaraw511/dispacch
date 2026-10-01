'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Box, 
  Navigation, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Zap, 
  TrendingUp, 
  Globe 
} from 'lucide-react';
import Navbar from './Navbar';
import Logo from './Logo';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 lg:px-12 flex flex-col items-center text-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Status Chip */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-8 backdrop-blur-md shadow-inner shadow-cyan-500/10">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 -ml-3" />
          Next-Gen Autonomous 3D Bin-Packing & Logistics Engine
        </div>

        {/* Title & Tagline */}
        <h1 className="relative max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Intelligent Fleet Allocation & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Autonomous Freight Dispatch
          </span>
        </h1>

        <p className="relative max-w-2xl text-slate-400 text-sm sm:text-base mt-6 leading-relaxed">
          Dispacch automatically solves complex 3D multi-box packing constraints, recommends the optimal vehicle mix from Tata Ace to 32ft Containers, and matches real-time competitive carrier tariffs.
        </p>

        {/* CTA Buttons */}
        <div className="relative flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href="/optimizer"
            className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-cyan-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Launch Fleet Optimizer
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/tracking"
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-sm font-semibold px-6 py-3.5 rounded-2xl transition duration-200 backdrop-blur"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            Track Existing Waybill
          </Link>
        </div>

        {/* Live Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mt-20 pt-10 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">98.4%</p>
            <p className="text-xs text-slate-400 mt-1">Cargo Volume Efficiency</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">5-Tier</p>
            <p className="text-xs text-slate-400 mt-1">Standard Fleet Catalog</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-400">Real-Time</p>
            <p className="text-xs text-slate-400 mt-1">Interactive 3D Packing</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-purple-400">100%</p>
            <p className="text-xs text-slate-400 mt-1">Verified Transporters</p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-[1400px] mx-auto w-full px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Logistics Modules</h2>
          <p className="text-xs text-slate-400 mt-1">Engineered for full supply-chain visibility and cost-per-ton reductions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            href="/optimizer"
            className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition duration-300 backdrop-blur flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition duration-300">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">3D Bin Packing & Fleet Sizing</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Algorithmic volumetric orientation solving cargo constraints. Determines the exact combination of vehicles needed for large multi-box manifests.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-cyan-400">
              Open Optimizer <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/tracking"
            className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition duration-300 backdrop-blur flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition duration-300">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">Live Freight Tracking</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Instant telemetric status of active consignments, GPS milestone updates, driver contact cards, and exact delivery dock ETAs.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-blue-400">
              Track Consignments <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/payments"
            className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition duration-300 backdrop-blur flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition duration-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">Billing & Prepaid Wallet</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Reconciliation ledgers, automated GST invoice generation, instant wallet top-ups, and freight rate index analytics.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              Manage Balances <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-8 text-center text-xs text-slate-500">
        <p>© 2026 DISPACCH Technologies Inc. • Autonomous Freight & Fleet Allocation Engine</p>
      </footer>
    </div>
  );
}