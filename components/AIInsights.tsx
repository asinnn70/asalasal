import React, { useState, useEffect } from 'react';
import { 
  Sparkles as SparklesIcon, 
  Brain as BrainIcon, 
  RefreshCw as RefreshCwIcon, 
  Loader2 as Loader2Icon,
  Lightbulb,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Product, Transaction, Supplier } from '../types';
import { getInventoryInsights } from '../services/gemini';

interface AIInsightsProps {
  products: Product[];
  transactions: Transaction[];
  suppliers?: Supplier[];
}

export default function AIInsights({ products, transactions, suppliers = [] }: AIInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsights = async () => {
    if (products.length === 0) return;
    setLoading(true);
    try {
      const result = await getInventoryInsights(products, transactions, suppliers);
      setInsight(result);
    } catch (err) {
      setInsight("Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!insight && products.length > 0) {
      generateInsights();
    }
  }, [products.length]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
      {/* Hero AI Section */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#a855f7] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-2xl p-4 rounded-[28px] border border-white/20 shadow-inner">
                <SparklesIcon className="text-yellow-300 animate-pulse" size={32} />
              </div>
              <div>
                 <h3 className="text-3xl font-black tracking-tight">Kecerdasan Bisnis Sakti</h3>
                 <p className="text-indigo-100 text-sm font-bold uppercase tracking-[0.2em] opacity-80">Asisten Strategis UMKM</p>
              </div>
            </div>
            <p className="text-indigo-50 text-xl leading-relaxed font-medium max-w-2xl opacity-90">
              Analisis mendalam pola stok, tren penjualan harian, dan rekomendasi pengadaan yang dioptimalkan khusus untuk bisnis Anda.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-bold">
                 <Zap size={14} className="text-yellow-400" /> Deteksi Real-time
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-bold">
                 <TrendingUp size={14} className="text-emerald-400" /> Prediksi Tren
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-bold">
                 <AlertCircle size={14} className="text-rose-300" /> Peringatan Cerdas
               </div>
            </div>
          </div>
          
          <button 
            disabled={loading}
            onClick={generateInsights}
            className="shrink-0 bg-white text-indigo-700 px-10 py-5 rounded-[28px] font-black text-lg flex items-center gap-3 hover:bg-indigo-50 hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-2xl shadow-indigo-900/30 group"
          >
            {loading ? <Loader2Icon className="animate-spin" size={24} /> : <RefreshCwIcon className="group-hover:rotate-180 transition-transform duration-700" size={24} />}
            {loading ? 'Berpikir...' : 'Mulai Analisis'}
          </button>
        </div>
        
        <div className="absolute -bottom-12 -right-12 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
          <BrainIcon size={250} />
        </div>
      </div>

      {/* Analysis Result */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-12 min-h-[500px] relative">
        <div className="absolute top-10 left-10 flex items-center gap-2 text-indigo-600 opacity-50">
           <Lightbulb size={24} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Laporan Terbaru</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 h-full">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                 <SparklesIcon className="text-indigo-400 animate-pulse" size={24} />
              </div>
            </div>
            <div className="text-center space-y-2">
               <p className="text-slate-800 font-extrabold text-2xl tracking-tight">Meracik Strategi Untukmu...</p>
               <p className="text-slate-400 font-medium">Asisten AI sedang membedah angka-angka bisnis Anda.</p>
            </div>
          </div>
        ) : insight ? (
          <div className="prose prose-indigo max-w-none pt-10">
            <div className="whitespace-pre-line text-slate-700 leading-[1.8] text-xl font-medium tracking-tight">
              {insight}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-slate-50 p-10 rounded-[40px] mb-8">
               <BrainIcon size={64} className="text-slate-200" />
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Analisis</h4>
            <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">Silakan klik tombol "Mulai Analisis" di atas untuk mendapatkan saran cerdas dari AI Sakti.</p>
          </div>
        )}
      </div>

      <div className="text-center pb-12">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            Didukung oleh <SparklesIcon size={14} className="text-indigo-600" /> Google Gemini 2.5 Flash
         </p>
      </div>
    </div>
  );
}
