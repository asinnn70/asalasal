import React, { useMemo } from 'react';
import { Transaction, TransactionType, Product } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Calendar,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface TodayTransactionsProps {
  transactions: Transaction[];
  products: Product[];
}

export default function TodayTransactions({ transactions, products }: TodayTransactionsProps) {
  const todayDate = new Date().toISOString().split('T')[0];

  const todayData = useMemo(() => {
    const filtered = transactions.filter(t => t.date.startsWith(todayDate));
    
    const inCount = filtered.filter(t => t.type === TransactionType.IN).reduce((acc, t) => acc + t.quantity, 0);
    const outCount = filtered.filter(t => t.type === TransactionType.OUT).reduce((acc, t) => acc + t.quantity, 0);
    
    const revenue = filtered
      .filter(t => t.type === TransactionType.OUT)
      .reduce((acc, t) => {
        const product = products.find(p => p.id === t.productId);
        return acc + (t.quantity * (product?.price || 0));
      }, 0);

    return {
      list: filtered,
      inCount,
      outCount,
      revenue
    };
  }, [transactions, products, todayDate]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Visual Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <Layers size={120} />
           </div>
           <div className="relative z-10 flex flex-col gap-4">
              <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md border border-white/20">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest opacity-80">Barang Masuk</p>
                <div className="flex items-baseline gap-2 mt-1">
                   <h4 className="text-4xl font-black">{todayData.inCount}</h4>
                   <span className="text-sm font-bold text-indigo-200">Unit</span>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between group">
           <div className="flex justify-between items-start">
              <div className="bg-rose-50 p-4 rounded-2xl text-rose-500 shadow-sm group-hover:rotate-6 transition-transform">
                <ShoppingBag size={28} />
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Terjual</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{todayData.outCount} <span className="text-lg text-slate-300">u</span></h4>
              </div>
           </div>
           <div className="mt-8 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-semibold text-slate-400">Efektivitas Persediaan</span>
                 <span className="text-xs font-black text-emerald-500">OPTIMAL</span>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between group">
           <div className="flex justify-between items-start">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Estimasi Pendapatan</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">Rp {todayData.revenue.toLocaleString()}</h4>
              </div>
           </div>
           <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
               </div>
               <span className="text-[10px] font-black text-slate-400">65% Target</span>
           </div>
        </div>
      </div>

      {/* Modern List View */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100/50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Calendar size={22} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Timeline Aktivitas</h3>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 text-xs font-black uppercase tracking-widest">
               {todayData.list.length} Transaksi Terdeteksi
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Waktu</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Detail Item</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Kategori Gerak</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Volume</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {todayData.list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <Clock size={48} className="text-slate-200 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-800 font-extrabold text-xl tracking-tight">Tenang Sekali Di Sini...</p>
                        <p className="text-slate-400 text-sm font-medium">Belum ada aktivitas stok yang tercatat untuk hari ini.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                todayData.list.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-7 whitespace-nowrap">
                      <p className="text-slate-400 text-xs font-black font-mono tracking-tighter bg-slate-100/50 w-fit px-2.5 py-1 rounded-lg">
                        {new Date(tx.date).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-10 py-7">
                      <p className="font-extrabold text-slate-800 text-sm tracking-tight">{tx.productName}</p>
                    </td>
                    <td className="px-10 py-7">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black w-fit border ${
                        tx.type === TransactionType.IN 
                          ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50/50 text-rose-600 border-rose-100'
                      }`}>
                        {tx.type === TransactionType.IN ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {tx.type === TransactionType.IN ? 'MASUK' : 'KELUAR'}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <p className={`text-lg font-black ${
                        tx.type === TransactionType.IN ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {tx.type === TransactionType.IN ? '+' : '-'}{tx.quantity} <span className="text-[10px] text-slate-300">u</span>
                      </p>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3 max-w-xs group-hover:translate-x-1 transition-transform">
                        <FileText size={16} className="text-slate-200 shrink-0" />
                        <p className="text-xs text-slate-500 font-medium italic truncate" title={tx.note}>{tx.note}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
