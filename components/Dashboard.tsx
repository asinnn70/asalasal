import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Package, TrendingUp, AlertTriangle, ArrowRight, Wallet, Users, Banknote, Sparkles } from 'lucide-react';
import { Product, Transaction, InventoryStats } from '../types';

interface DashboardProps {
  stats: InventoryStats;
  products: Product[];
  transactions: Transaction[];
  onTabChange: (tab: 'dashboard' | 'inventory' | 'history' | 'ai' | 'suppliers' | 'reports' | 'today') => void;
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function Dashboard({ stats, products, transactions, onTabChange }: DashboardProps) {
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Prep chart data
  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += p.stock;
    } else {
      acc.push({ name: p.category, value: p.stock });
    }
    return acc;
  }, []);

  const recentTrends = [
    { name: 'Sen', in: 12, out: 8 },
    { name: 'Sel', in: 19, out: 12 },
    { name: 'Rab', in: 15, out: 15 },
    { name: 'Kam', in: 8, out: 18 },
    { name: 'Jum', in: 22, out: 10 },
    { name: 'Sab', in: 30, out: 25 },
    { name: 'Min', in: 10, out: 5 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali! 👋</h1>
          <p className="text-slate-500 mt-1 font-medium">Berikut adalah rangkuman performa bisnis Anda hari ini.</p>
        </div>
        <button 
          onClick={() => onTabChange('ai')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
        >
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          Tanya Asisten AI
        </button>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard 
          icon={<Banknote className="text-emerald-600" />} 
          title="Omzet Hari Ini" 
          value={`Rp ${stats.todayRevenue.toLocaleString()}`} 
          color="emerald"
          trend="+12.5% dari kemarin"
        />
        <StatCard 
          icon={<Package className="text-indigo-600" />} 
          title="Item Tersedia" 
          value={stats.totalItems.toLocaleString()} 
          color="indigo"
          trend="3 produk baru ditambahkan"
        />
        <StatCard 
          icon={<Wallet className="text-blue-600" />} 
          title="Nilai Aset" 
          value={`Rp ${stats.totalValue.toLocaleString()}`} 
          color="blue"
        />
        <StatCard 
          icon={<AlertTriangle className="text-rose-600" />} 
          title="Peringatan Stok" 
          value={stats.lowStockCount.toString()} 
          color="rose"
          highlight={stats.lowStockCount > 0}
          trend={stats.lowStockCount > 0 ? "Butuh tindakan segera" : "Semua aman"}
        />
        <StatCard 
          icon={<Users className="text-slate-600" />} 
          title="Partner Supplier" 
          value={stats.totalSuppliers.toString()} 
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Activity Chart Container */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Dinamika Persediaan</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Laporan 7 hari terakhir</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl">
               <button className="px-4 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg shadow-sm">Mingguan</button>
               <button className="px-4 py-1.5 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Bulanan</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentTrends}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="in" stroke="#6366f1" fillOpacity={1} fill="url(#colorIn)" strokeWidth={4} name="Masuk" />
                <Area type="monotone" dataKey="out" stroke="#f43f5e" fillOpacity={1} fill="url(#colorOut)" strokeWidth={4} name="Keluar" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">Mix Kategori</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Berdasarkan jumlah stok</p>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{products.reduce((acc,p)=>acc+p.stock, 0)}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Stok</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{cat.value} u</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Low Stock Alerts */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Kritis & Terbatas</h3>
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Aksi segera diperlukan</p>
            </div>
            <button 
              onClick={() => onTabChange('inventory')}
              className="p-2.5 bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                <div className="bg-white p-4 rounded-full shadow-sm">
                  <TrendingUp className="text-emerald-500" size={32} />
                </div>
                <p className="text-emerald-700 font-bold">Luar biasa! Semua stok terpenuhi.</p>
              </div>
            ) : (
              lowStockItems.slice(0, 4).map(product => (
                <div key={product.id} className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 rounded-[24px] border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-rose-50 transition-colors">
                      <Package className="text-rose-500" size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm tracking-tight">{product.name}</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                       <span className="text-rose-600 font-black text-lg">{product.stock}</span>
                       <span className="text-slate-300 text-xs">/ {product.minStock}</span>
                    </div>
                    <div className="w-16 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                       <div className="h-full bg-rose-500" style={{ width: `${(product.stock/product.minStock)*100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modern Transaction Feed */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-8">
             <div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Log Terbaru</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Daftar transaksi terakhir</p>
             </div>
             <button 
              onClick={() => onTabChange('history')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Semua Riwayat
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center gap-5 p-4 bg-white border border-slate-50 rounded-2xl hover:border-indigo-100 transition-colors">
                <div className={`p-2.5 rounded-xl shadow-sm ${tx.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {tx.type === 'IN' ? <TrendingUp size={18} /> : <TrendingUp className="rotate-180" size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{tx.productName}</p>
                  <p className="text-slate-400 text-[10px] italic truncate">"{tx.note}"</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-black text-sm ${tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'IN' ? '+' : '-'}{tx.quantity} u
                  </p>
                  <p className="text-slate-400 text-[9px] font-bold">
                    {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color, highlight = false, trend }: any) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className={`p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden ${highlight ? 'ring-2 ring-rose-500/20' : ''}`}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className={`p-4 rounded-2xl ${colorMap[color]} shadow-sm group-hover:scale-110 transition-transform`}>
            {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
          </div>
          {highlight && <div className="animate-ping bg-rose-500 h-2 w-2 rounded-full"></div>}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">{title}</p>
          <p className={`text-2xl font-black mt-1 tracking-tight ${highlight ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
          {trend && (
            <p className={`text-[10px] font-bold mt-2 ${color === 'emerald' ? 'text-emerald-500' : color === 'rose' ? 'text-rose-500' : 'text-slate-400'}`}>
               {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
