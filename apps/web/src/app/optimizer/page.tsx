'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Box,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Fuel,
  Gauge,
  ShieldCheck,
  Maximize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Viewer3D from '../Viewer3D';
import Navbar from '../Navbar';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
interface BoxItem {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
}

export default function OptimizerPage() {
  const [bookingMode, setBookingMode] = useState<'dedicated' | 'shared'>('dedicated');
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [pickupCity, setPickupCity] = useState('Central Warehouse');
  const [dropCity, setDropCity] = useState('Regional Hub');

  
  const [items, setItems] = useState<BoxItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', width: 60, height: 60, depth: 80, weight: 45 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [sharedResult, setSharedResult] = useState<any>(null);
  const [selectedTruckIndex, setSelectedTruckIndex] = useState<number>(0);
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Restore session
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('dispacch_items');
      const savedDist = localStorage.getItem('dispacch_dist');
      const savedPickup = localStorage.getItem('dispacch_pickup');
      const savedDrop = localStorage.getItem('dispacch_drop');

      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        // Only load if user deliberately added items, otherwise keep empty
        if (Array.isArray(parsed)) setItems(parsed);
      } else {
        setItems([]);
      }
      if (savedDist) setDistanceKm(Number(savedDist));
      if (savedPickup) setPickupCity(savedPickup);
      if (savedDrop) setDropCity(savedDrop);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dispacch_items', JSON.stringify(items));
    localStorage.setItem('dispacch_dist', String(distanceKm));
    localStorage.setItem('dispacch_pickup', pickupCity);
    localStorage.setItem('dispacch_drop', dropCity);
  }, [items, distanceKm, pickupCity, dropCity]);

  const handleNewBooking = () => {
    localStorage.removeItem('dispacch_items');
    setItems([]);
    setResult(null);
    setSharedResult(null);
    setError(null);
    setSelectedTruckIndex(0);
    setSelectedPoolIndex(0);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: newItem.name,
        width: Number(newItem.width),
        height: Number(newItem.height),
        depth: Number(newItem.depth),
        weight: Number(newItem.weight),
      },
    ]);
    setNewItem({ name: '', width: 60, height: 60, depth: 80, weight: 45 });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const runDedicatedOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/recommend/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, distance_km: distanceKm }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setResult(null);
      } else {
        setResult(data);
        setSelectedTruckIndex(0);
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const runSharedPoolSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/recommend/shared-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          pickup_city: pickupCity,
          drop_city: dropCity,
          distance_km: distanceKm,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        setSharedResult(null);
      } else {
        setSharedResult(data);
        setSelectedPoolIndex(0);
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setError(err.message || 'Failed connecting to shared pools engine.');
    } finally {
      setLoading(false);
    }
  };

  const totalItemWeight = items.reduce((acc, it) => acc + it.weight, 0);

  // Active Vehicle in view
  const currentTruckData = result?.fleet?.[selectedTruckIndex];
  const activePool = sharedResult?.pools?.[selectedPoolIndex];

  const activeTruck = bookingMode === 'dedicated'
    ? currentTruckData?.vehicle || {
        type: 'Standard Commercial Container',
        width: 240,
        height: 240,
        depth: 600,
        max_weight: 9000,
      }
    : activePool
    ? {
        type: activePool.truck_type,
        width: activePool.container_dims.width,
        height: activePool.container_dims.height,
        depth: activePool.container_dims.depth,
        max_weight: activePool.container_dims.max_weight,
      }
    : {
        type: '14ft Shared Freight Canter',
        width: 200,
        height: 210,
        depth: 420,
        max_weight: 4000,
      };

  const packedItems3D = bookingMode === 'dedicated'
    ? (currentTruckData ? currentTruckData.packed_items : [])
    : (activePool ? activePool.packed_3d : []);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 p-8 max-w-[1550px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Route, Manifest, and Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Booking Mode Switcher */}
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setBookingMode('dedicated')}
              className={`py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                bookingMode === 'dedicated'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" /> Dedicated Fleet
            </button>
            <button
              type="button"
              onClick={() => setBookingMode('shared')}
              className={`py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                bookingMode === 'shared'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Community Pool (LTL)
            </button>
          </div>

          {/* Route Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-xl">
            <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-cyan-400" /> Route & Trip Corridor
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400">Pickup Location</label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400">Drop Location</label>
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-3 text-xs">
              <label className="text-slate-400">Trip Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 mt-1 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Cargo Manifest */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" /> Cargo Manifest ({items.length})
              </h2>
              <span className="text-xs text-slate-400 font-mono">Total: {totalItemWeight} kg</span>
            </div>

            <form onSubmit={addItem} className="grid grid-cols-6 gap-2 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <input
                type="text"
                placeholder="Label"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-2 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="W"
                value={newItem.width}
                onChange={(e) => setNewItem({ ...newItem, width: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="H"
                value={newItem.height}
                onChange={(e) => setNewItem({ ...newItem, height: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="D"
                value={newItem.depth}
                onChange={(e) => setNewItem({ ...newItem, depth: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-semibold rounded text-xs flex items-center justify-center transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-200">{it.name}</p>
                    <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                      {it.width} × {it.height} × {it.depth} cm • {it.weight} kg
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleNewBooking}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 px-3 py-2.5 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={bookingMode === 'dedicated' ? runDedicatedOptimization : runSharedPoolSearch}
                disabled={loading || items.length === 0}
                className={`flex-1 py-3 rounded-xl font-semibold text-xs text-white shadow-xl transition active:scale-95 flex items-center justify-center gap-2 ${
                  bookingMode === 'dedicated'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {loading
                  ? 'Calculating Load Space...'
                  : bookingMode === 'dedicated'
                  ? 'Solve Dedicated Fleet'
                  : 'Find Shared Community Trucks'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visualization, Fleet/Pool Info & Carrier Rates (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode-Specific Status Banner */}
          {bookingMode === 'dedicated' && result?.fleet && (
            <div className="bg-gradient-to-r from-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                  Dedicated Multi-Fleet Decomposition
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Requires {result.total_vehicles_needed} Vehicle{result.total_vehicles_needed > 1 ? 's' : ''}
                </h3>
              </div>
              {result.total_vehicles_needed > 1 && (
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSelectedTruckIndex(Math.max(0, selectedTruckIndex - 1))}
                    disabled={selectedTruckIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 text-cyan-400">
                    Truck {selectedTruckIndex + 1} / {result.total_vehicles_needed}
                  </span>
                  <button
                    onClick={() => setSelectedTruckIndex(Math.min(result.total_vehicles_needed - 1, selectedTruckIndex + 1))}
                    disabled={selectedTruckIndex === result.total_vehicles_needed - 1}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {bookingMode === 'shared' && sharedResult?.pools && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Community Partial Load Pool Found
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {sharedResult.matches_count} Scheduled Vehicle{sharedResult.matches_count > 1 ? 's' : ''} Available
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sharing saves up to 68% over chartering an empty vehicle.
                </p>
              </div>
              {sharedResult.matches_count > 1 && (
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSelectedPoolIndex(Math.max(0, selectedPoolIndex - 1))}
                    disabled={selectedPoolIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 text-emerald-400">
                    Route {selectedPoolIndex + 1} / {sharedResult.matches_count}
                  </span>
                  <button
                    onClick={() => setSelectedPoolIndex(Math.min(sharedResult.matches_count - 1, selectedPoolIndex + 1))}
                    disabled={selectedPoolIndex === sharedResult.matches_count - 1}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3D Container Engine */}
          <Viewer3D
            truck={activeTruck}
            packedItems={packedItems3D}
            allManifestItems={items}
          />

          {/* Dedicated Mode Vehicle Info */}
          {bookingMode === 'dedicated' && currentTruckData && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    Vehicle {selectedTruckIndex + 1} of {result.total_vehicles_needed}
                  </span>
                  <h3 className="text-lg font-bold text-white">{currentTruckData.vehicle.type}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Space Utilized</span>
                  <p className="text-lg font-bold font-mono text-cyan-400">{currentTruckData.utilization_pct}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Clearance</span>
                  <p className="font-mono text-white mt-0.5">
                    {currentTruckData.vehicle.width}×{currentTruckData.vehicle.height}×{currentTruckData.vehicle.depth}cm
                  </p>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Chassis</span>
                  <p className="text-white mt-0.5">{currentTruckData.vehicle.specs?.axles}</p>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Powertrain</span>
                  <p className="text-white mt-0.5">{currentTruckData.vehicle.specs?.fuel}</p>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Leg Tariff</span>
                  <p className="font-mono text-emerald-400 font-bold mt-0.5">₹{currentTruckData.est_cost}</p>
                </div>
              </div>
            </div>
          )}

          {/* Shared Pool Info */}
          {bookingMode === 'shared' && activePool && (
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    {activePool.pool_id} • {activePool.carrier}
                  </span>
                  <h3 className="text-lg font-bold text-white">{activePool.route}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Departs: {activePool.departure_time}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Your Share Rate</span>
                  <p className="text-2xl font-bold font-mono text-emerald-400">₹{activePool.total_shared_price}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Vehicle Model</span>
                  <p className="text-white mt-0.5">{activePool.truck_type}</p>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Your Space Share</span>
                  <p className="text-cyan-400 font-bold mt-0.5">{activePool.your_share_pct}% Volume</p>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Remaining Spare Space</span>
                  <p className="text-emerald-400 font-bold mt-0.5">{activePool.spare_capacity_remaining}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}