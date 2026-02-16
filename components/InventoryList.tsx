
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Package, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { Product, TransactionType } from '../types';

interface InventoryListProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  onUpdateStock: (productId: string, quantity: number, type: TransactionType, note: string) => void;
}

type SortKey = 'name' | 'stock' | 'price' | 'category';
type SortDirection = 'asc' | 'desc';

export default function InventoryList({ products, onAddProduct, onUpdateStock }: InventoryListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<{id: string, name: string} | null>(null);
  const [updateType, setUpdateType] = useState<TransactionType>(TransactionType.IN);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'name',
    direction: 'asc'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    sku: '',
    stock: 0,
    minStock: 5,
    price: 0,
    description: ''
  });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    const sortableItems = [...products];
    return sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [products, sortConfig]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setShowAddModal(false);
    setNewProduct({ name: '', category: '', sku: '', stock: 0, minStock: 5, price: 0, description: '' });
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (showUpdateModal) {
      onUpdateStock(showUpdateModal.id, quantity, updateType, note);
      setShowUpdateModal(null);
      setNote('');
      setQuantity(1);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="text-slate-300" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-indigo-600" /> 
      : <ChevronDown size={14} className="text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800">Daftar Produk</h3>
          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">
            {products.length} Produk
          </span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Info Produk <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-2">
                    Kategori <SortIcon column="category" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Harga <SortIcon column="price" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-2">
                    Stok <SortIcon column="stock" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedProducts.map(product => {
                const isLow = product.stock <= product.minStock;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isLow ? 'bg-red-50' : 'bg-slate-100'}`}>
                          <Package className={isLow ? 'text-red-500' : 'text-slate-500'} size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{product.name}</p>
                          <p className="text-slate-500 text-xs">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">Rp {product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>
                        {product.stock} unit
                      </p>
                      <p className="text-[10px] text-slate-400">Min: {product.minStock}</p>
                    </td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          Stok Kritis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Tersedia
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setShowUpdateModal({id: product.id, name: product.name}); setUpdateType(TransactionType.IN); }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Stok Masuk"
                        >
                          <ArrowUpCircle size={18} />
                        </button>
                        <button 
                          onClick={() => { setShowUpdateModal({id: product.id, name: product.name}); setUpdateType(TransactionType.OUT); }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Stok Keluar"
                        >
                          <ArrowDownCircle size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals remain the same... */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-xl font-bold text-slate-800">Tambah Produk Baru</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Produk</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Misal: Kopi Gula Aren"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">SKU</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="SKU-001"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Minuman/Makanan"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stok Awal</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Min. Stok</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newProduct.minStock}
                    onChange={e => setNewProduct({...newProduct, minStock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})}
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${updateType === TransactionType.IN ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <div>
                <h4 className="text-xl font-bold text-slate-800">Stok {updateType === TransactionType.IN ? 'Masuk' : 'Keluar'}</h4>
                <p className="text-slate-500 text-sm">{showUpdateModal.name}</p>
              </div>
              <button onClick={() => setShowUpdateModal(null)} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah</label>
                <input 
                  autoFocus
                  required
                  type="number"
                  min="1"
                  className="w-full text-2xl font-bold text-center py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500" 
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Catatan</label>
                <textarea 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Contoh: Pengisian dari supplier / Penjualan kasir"
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowUpdateModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-2.5 text-white rounded-xl font-bold shadow-lg transition-colors ${
                    updateType === TransactionType.IN 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' 
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
                  }`}
                >
                  Konfirmasi {updateType === TransactionType.IN ? 'Masuk' : 'Keluar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
