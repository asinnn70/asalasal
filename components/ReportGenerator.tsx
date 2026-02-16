
import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  FileText,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Product, Transaction, Supplier, TransactionType } from '../types';

interface ReportGeneratorProps {
  products: Product[];
  transactions: Transaction[];
  suppliers: Supplier[];
}

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#4ade80', '#fbbf24', '#f87171'];

export default function ReportGenerator({ products, transactions, suppliers }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'inventory' | 'transaction' | 'full'>('full');
  const [period, setPeriod] = useState<'7d' | '30d' | 'month'>('30d');

  // Logic data processing
  const reportData = useMemo(() => {
    const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
    const inTransactions = transactions.filter(t => t.type === TransactionType.IN);
    const outTransactions = transactions.filter(t => t.type === TransactionType.OUT);
    
    const totalInQty = inTransactions.reduce((acc, t) => acc + t.quantity, 0);
    const totalOutQty = outTransactions.reduce((acc, t) => acc + t.quantity, 0);

    const categorySummary = products.reduce((acc: any[], p) => {
      const existing = acc.find(item => item.name === p.category);
      if (existing) {
        existing.value += p.stock;
        existing.worth += (p.stock * p.price);
      } else {
        acc.push({ name: p.category, value: p.stock, worth: p.stock * p.price });
      }
      return acc;
    }, []);

    return {
      totalStockValue,
      totalInQty,
      totalOutQty,
      categorySummary,
      lowStockCount: products.filter(p => p.stock <= p.minStock).length
    };
  }, [products, transactions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 no-print">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setReportType('full')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'full' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Laporan Lengkap
            </button>
            <button 
              onClick={() => setReportType('inventory')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Stok Saja
            </button>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="month">Bulan Ini</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
            <Download size={18} /> Ekspor CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
          >
            <Printer size={18} /> Cetak Laporan
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 min-h-screen printable-area">
        {/* Report Header */}
        <div className="border-b-2 border-slate-100 pb-8 mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sakti Inventory Report</h1>
            </div>
            <p className="text-slate-500 font-medium">Laporan Operasional Bisnis UMKM</p>
            <p className="text-slate-400 text-sm mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-800">Periode Laporan</p>
            <p className="text-indigo-600 font-semibold">{period === '7d' ? '7 Hari' : period === '30d' ? '30 Hari' : 'Bulan Ini'}</p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">
              <TrendingUp size={16} /> Nilai Inventaris
            </div>
            <p className="text-3xl font-black text-slate-800">Rp {reportData.totalStockValue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium italic">Estimasi total nilai stok gudang saat ini</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">
              <ArrowUpRight size={16} className="text-emerald-500" /> Barang Masuk
            </div>
            <p className="text-3xl font-black text-slate-800">{reportData.totalInQty} unit</p>
            <p className="text-xs text-slate-400 mt-2 font-medium italic">Total volume pengisian stok</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">
              <ArrowDownRight size={16} className="text-rose-500" /> Barang Keluar
            </div>
            <p className="text-3xl font-black text-slate-800">{reportData.totalOutQty} unit</p>
            <p className="text-xs text-slate-400 mt-2 font-medium italic">Total volume penjualan / pemakaian</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieChartIcon size={20} className="text-indigo-600" /> Komposisi Kategori (Unit)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.categorySummary}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.categorySummary.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChartIcon size={20} className="text-indigo-600" /> Nilai Stok per Kategori (Rp)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.categorySummary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val/1000}k`} />
                  <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                  <Bar dataKey="worth" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" /> Detil Inventaris Kritis
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Sisa Stok</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.filter(p => p.stock <= p.minStock).map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-rose-600">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Segera Isi</span>
                    </td>
                  </tr>
                ))}
                {products.filter(p => p.stock <= p.minStock).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">Tidak ada stok yang dalam kondisi kritis saat ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
            <div>
              <p className="text-slate-400 text-xs">Sakti Inventory v2.0</p>
              <p className="text-slate-400 text-[10px]">Dicetak secara otomatis dari sistem manajemen UMKM</p>
            </div>
            <div className="text-center w-48 border-t border-slate-300 pt-2">
              <p className="text-sm font-bold text-slate-700">Tanda Tangan Manajer</p>
              <div className="h-12"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
          .printable-area { border: none !important; shadow: none !important; padding: 0 !important; }
          aside, header, main > header { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
          .printable-area { width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
