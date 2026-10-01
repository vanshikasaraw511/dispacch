'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Download, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../Navbar';

interface Transaction {
  id: string;
  description: string;
  type: 'debit' | 'credit';
  amount: number;
  date: string;
  status: 'Completed' | 'Processing';
  invoiceId: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-94810',
    description: 'Booking: 14ft Canter (Delhi to Jaipur)',
    type: 'debit',
    amount: 2870,
    date: 'Today, 02:15 PM',
    status: 'Completed',
    invoiceId: 'INV-2026-091',
  },
  {
    id: 'TXN-94809',
    description: 'Wallet Balance Top-up (NEFT / Corporate NetBanking)',
    type: 'credit',
    amount: 25000,
    date: 'Yesterday, 11:30 AM',
    status: 'Completed',
    invoiceId: 'INV-2026-090',
  },
  {
    id: 'TXN-94808',
    description: 'Booking: 32ft Heavy Multi-Axle (Mumbai to BLR)',
    type: 'debit',
    amount: 14200,
    date: '28 Sep 2026',
    status: 'Completed',
    invoiceId: 'INV-2026-089',
  },
];

export default function PaymentsPage() {
  const [balance, setBalance] = useState(42500);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('dispacch_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u.walletBalance !== undefined) setBalance(u.walletBalance);
      } catch (e) {}
    }
  }, []);

  const handleTopUp = () => {
    const newBal = balance + Number(topUpAmount);
    setBalance(newBal);

    const newTx: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      description: 'Prepaid Freight Balance Top-up',
      type: 'credit',
      amount: Number(topUpAmount),
      date: 'Just now',
      status: 'Completed',
      invoiceId: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    };

    setTransactions([newTx, ...transactions]);

    // Update stored user
    const raw = localStorage.getItem('dispacch_user');
    if (raw) {
      const u = JSON.parse(raw);
      u.walletBalance = newBal;
      localStorage.setItem('dispacch_user', JSON.stringify(u));
    }

    setShowTopUpModal(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 p-8 max-w-[1550px] mx-auto w-full space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" /> Payments & Freight Billing
          </h2>
          <p className="text-xs text-slate-400">Prepaid fleet balances, settlement ledgers, and GST invoices</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Available Wallet Balance</span>
                <p className="text-3xl font-bold text-white font-mono mt-1">₹{balance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="mt-6 flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Balance
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Total Dispatched Freight</span>
            <p className="text-3xl font-bold text-slate-200 font-mono mt-1">₹68,450</p>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 14 Loads successfully delivered
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Payment Terms</span>
            <p className="text-xl font-bold text-white mt-1">Prepaid Credit Line</p>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Verified GSTIN Invoicing enabled
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur shadow-xl space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">Recent Invoices & Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Transaction</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-950/40">
                    <td className="py-3.5 flex items-center gap-2.5">
                      {tx.type === 'credit' ? (
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-200">{tx.description}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{tx.id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{tx.date}</td>
                    <td className="py-3.5 font-mono text-cyan-400">{tx.invoiceId}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3.5 font-mono font-bold text-right ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-slate-400 hover:text-cyan-400 p-1.5 transition">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
              <h3 className="text-base font-bold text-white">Add Balance to Wallet</h3>
              <p className="text-xs text-slate-400">Enter amount to add via instant simulated UPI / NetBanking:</p>
              <div className="grid grid-cols-3 gap-2">
                {[2000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition ${
                      topUpAmount === amt
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTopUp}
                  className="w-1/2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}