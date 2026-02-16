
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowUpRight, ArrowDownRight, Clock, FileText } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800">Riwayat Transaksi</h3>
        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">
          {transactions.length} Entri
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock size={16} className="text-slate-400" />
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{tx.productName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
                        tx.type === TransactionType.IN 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {tx.type === TransactionType.IN ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {tx.type === TransactionType.IN ? 'MASUK' : 'KELUAR'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-bold ${
                        tx.type === TransactionType.IN ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === TransactionType.IN ? '+' : '-'}{tx.quantity} unit
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-xs">
                        <FileText size={16} className="text-slate-300 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-500 italic">{tx.note}</p>
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
