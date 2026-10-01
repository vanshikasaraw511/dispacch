'use client';

import React, { useState } from 'react';
import { Search, Navigation, Truck, MapPin, Clock, CheckCircle2, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import Navbar from '../Navbar';

interface Shipment {
  id: string;
  trackingNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Scheduled';
  progressPct: number;
  currentMilestone: string;
  eta: string;
  totalWeight: number;
}

const mockShipments: Shipment[] = [
  {
    id: 'SHP-9021',
    trackingNumber: 'DISP-88492019',
    vehicleType: '14ft Commercial Canter',
    vehiclePlate: 'DL 01 AB 4920',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98112 33421',
    origin: 'Central Distribution Center, Gurugram',
    destination: 'Regional Fulfillment Hub, Jaipur',
    status: 'In Transit',
    progressPct: 65,
    currentMilestone: 'Passed Shahjahanpur Toll Plaza • NH 48',
    eta: 'Today, 04:30 PM (2 hrs remaining)',
    totalWeight: 2600,
  },
  {
    id: 'SHP-9022',
    trackingNumber: 'DISP-44029102',
    vehicleType: '32ft Multi-Axle Container',
    vehiclePlate: 'MH 12 QX 8831',
    driverName: 'Sukhwinder Singh',
    driverPhone: '+91 97200 48110',
    origin: 'Bhiwandi Logistics Park, Mumbai',
    destination: 'Whitefield Depot, Bengaluru',
    status: 'In Transit',
    progressPct: 35,
    currentMilestone: 'En route Pune Ring Road • Speed 62 km/h',
    eta: 'Tomorrow, 08:00 AM',
    totalWeight: 14500,
  },
  {
    id: 'SHP-9023',
    trackingNumber: 'DISP-11928442',
    vehicleType: 'Mini Truck (Tata Ace)',
    vehiclePlate: 'UP 16 CZ 1204',
    driverName: 'Amit Verma',
    driverPhone: '+91 94500 11920',
    origin: 'Sector 62, Noida',
    destination: 'Okhla Phase III, South Delhi',
    status: 'Out for Delivery',
    progressPct: 90,
    currentMilestone: 'Approaching Delivery Dock 2',
    eta: 'Today, 25 mins',
    totalWeight: 680,
  },
];

export default function TrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(mockShipments[0]);

  const filtered = mockShipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 p-8 max-w-[1550px] mx-auto w-full space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" /> Active Freight Tracking
            </h2>
            <p className="text-xs text-slate-400">Live GPS tracking & trip milestone monitoring</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Waybill / Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* 2-Column Split: List & Live Telemetry Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Shipments List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            {filtered.map((shp) => {
              const isSelected = selectedShipment.id === shp.id;
              return (
                <div
                  key={shp.id}
                  onClick={() => setSelectedShipment(shp)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400">{shp.trackingNumber}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {shp.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mt-2">{shp.vehicleType}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{shp.origin.split(',')[0]} → {shp.destination.split(',')[0]}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Trip Progress</span>
                      <span className="font-mono text-cyan-400">{shp.progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${shp.progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Tracking Viewport (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur shadow-xl space-y-6">
              {/* Waybill Title */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Waybill Consignment</span>
                  <h3 className="text-2xl font-bold font-mono text-white mt-0.5">{selectedShipment.trackingNumber}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Arrival</span>
                  <p className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4" /> {selectedShipment.eta}
                  </p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Route Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">Origin Terminal</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{selectedShipment.origin}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-xs font-semibold text-cyan-300">Current Position</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">{selectedShipment.currentMilestone}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Final Destination</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{selectedShipment.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Truck telemetry info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Assigned Vehicle</p>
                      <p className="text-sm font-bold text-white">{selectedShipment.vehicleType}</p>
                      <p className="text-[11px] font-mono text-cyan-400">{selectedShipment.vehiclePlate}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{selectedShipment.totalWeight} kg</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Assigned Driver</p>
                    <p className="text-sm font-bold text-white">{selectedShipment.driverName}</p>
                    <p className="text-[11px] font-mono text-slate-400">{selectedShipment.driverPhone}</p>
                  </div>
                  <a
                    href={`tel:${selectedShipment.driverPhone}`}
                    className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/30 text-cyan-300 hover:text-white transition"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}