
import React, { useState } from 'react';
import { Plus, Users, Mail, Phone, MapPin, Tag, MoreVertical, ExternalLink } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierListProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

export default function SupplierList({ suppliers, onAddSupplier }: SupplierListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupplier(newSupplier);
    setShowAddModal(false);
    setNewSupplier({ name: '', contactName: '', phone: '', email: '', address: '', category: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800">Daftar Supplier</h3>
          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">
            {suppliers.length} Supplier
          </span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Tambah Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Users size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-600 p-1">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h4 className="font-bold text-lg text-slate-800 mb-1">{supplier.name}</h4>
            <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
              <Tag size={14} /> {supplier.category}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><Users size={14} className="text-slate-400" /></div>
                <span className="font-medium">{supplier.contactName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><Phone size={14} className="text-slate-400" /></div>
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><Mail size={14} className="text-slate-400" /></div>
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-slate-50 rounded-lg"><MapPin size={14} className="text-slate-400" /></div>
                <span className="truncate">{supplier.address}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <ExternalLink size={14} /> Hubungi Supplier
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-xl font-bold text-slate-800">Tambah Supplier Baru</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Perusahaan / Supplier</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Misal: PT Makmur Sentosa"
                    value={newSupplier.name}
                    onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kontak</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Nama Sales/PIC"
                    value={newSupplier.contactName}
                    onChange={e => setNewSupplier({...newSupplier, contactName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Produk</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Misal: Bahan Baku"
                    value={newSupplier.category}
                    onChange={e => setNewSupplier({...newSupplier, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telepon</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="0812..."
                    value={newSupplier.phone}
                    onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input 
                    required
                    type="email"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="email@provider.com"
                    value={newSupplier.email}
                    onChange={e => setNewSupplier({...newSupplier, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Alamat gudang/kantor"
                    rows={2}
                    value={newSupplier.address}
                    onChange={e => setNewSupplier({...newSupplier, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Simpan Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
