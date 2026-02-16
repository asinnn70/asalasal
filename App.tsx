import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  AlertTriangle, 
  Plus, 
  TrendingUp,
  Search,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Users,
  FileBarChart,
  CalendarDays,
  Bell,
  Settings
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import TransactionHistory from './components/TransactionHistory';
import AIInsights from './components/AIInsights';
import SupplierList from './components/SupplierList';
import ReportGenerator from './components/ReportGenerator';
import TodayTransactions from './components/TodayTransactions';
import { Product, Transaction, TransactionType, Supplier } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kopi Robusta 250g', category: 'Minuman', sku: 'KOP-RB-250', stock: 45, minStock: 10, price: 35000, description: 'Biji kopi robusta pilihan dari Temanggung.', updatedAt: new Date().toISOString() },
  { id: '2', name: 'Gula Aren Cair 500ml', category: 'Bahan Baku', sku: 'GL-AR-500', stock: 8, minStock: 15, price: 25000, description: 'Gula aren murni organik.', updatedAt: new Date().toISOString() },
  { id: '3', name: 'Susu UHT 1L', category: 'Minuman', sku: 'SS-UHT-1L', stock: 24, minStock: 12, price: 18000, description: 'Susu sapi segar kemasan.', updatedAt: new Date().toISOString() },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', productId: '1', productName: 'Kopi Robusta 250g', type: TransactionType.IN, quantity: 50, date: new Date(Date.now() - 86400000).toISOString(), note: 'Stok baru supplier' },
  { id: 't2', productId: '1', productName: 'Kopi Robusta 250g', type: TransactionType.OUT, quantity: 5, date: new Date().toISOString(), note: 'Penjualan offline' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'PT Kopi Jaya', contactName: 'Budi Santoso', phone: '08123456789', email: 'kontak@kopijaya.com', address: 'Temanggung, Jateng', category: 'Biji Kopi' },
  { id: 's2', name: 'Gula Organik Sejahtera', contactName: 'Siti Aminah', phone: '08987654321', email: 'sales@gulaorganik.id', address: 'Kulon Progo, DIY', category: 'Pemanis' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'history' | 'ai' | 'suppliers' | 'reports' | 'today'>('dashboard');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('umkm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('umkm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('umkm_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('umkm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('umkm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('umkm_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const addProduct = (product: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateStock = (productId: string, quantity: number, type: TransactionType, note: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = type === TransactionType.IN ? product.stock + quantity : product.stock - quantity;
    if (newStock < 0) {
      alert("Stok tidak mencukupi!");
      return;
    }

    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } 
        : p
    ));

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      productName: product.name,
      type,
      quantity,
      date: new Date().toISOString(),
      note
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayRevenue = transactions
      .filter(t => t.type === TransactionType.OUT && t.date.startsWith(today))
      .reduce((acc, t) => {
        const product = products.find(p => p.id === t.productId);
        return acc + (t.quantity * (product?.price || 0));
      }, 0);

    return {
      totalItems: products.length,
      totalValue: products.reduce((acc, p) => acc + (p.stock * p.price), 0),
      lowStockCount: products.filter(p => p.stock <= p.minStock).length,
      totalTransactions: transactions.length,
      totalSuppliers: suppliers.length,
      todayRevenue
    };
  }, [products, transactions, suppliers]);

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard Utama',
    inventory: 'Manajemen Inventaris',
    history: 'Riwayat Transaksi',
    ai: 'Analisis Pintar AI',
    suppliers: 'Kemitraan Supplier',
    reports: 'Laporan Bisnis',
    today: 'Ringkasan Hari Ini'
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-sans">
      {/* Sidebar Modern */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-200/60 transition-all duration-500 ease-in-out flex flex-col z-50 shadow-sm`}>
        <div className="p-8 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shrink-0 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Package className="text-white h-6 w-6" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-xl text-slate-800 tracking-tight whitespace-nowrap">Sakti UMKM</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Inventory v2.0</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Transaksi Hari Ini" 
            active={activeTab === 'today'} 
            onClick={() => setActiveTab('today')} 
            collapsed={!isSidebarOpen}
            badge={transactions.filter(t => t.date.startsWith(new Date().toISOString().split('T')[0])).length}
          />
          <div className="my-4 px-4">
            <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ${!isSidebarOpen && 'text-center'}`}>
              {isSidebarOpen ? 'Operasional' : '•'}
            </p>
          </div>
          <NavItem 
            icon={<Package size={20} />} 
            label="Inventaris" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Supplier" 
            active={activeTab === 'suppliers'} 
            onClick={() => setActiveTab('suppliers')} 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Riwayat" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<FileBarChart size={20} />} 
            label="Laporan" 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
            collapsed={!isSidebarOpen}
          />
          
          <div className="pt-6 mt-6 border-t border-slate-100/50">
             <NavItem 
              icon={<Sparkles size={20} className={activeTab === 'ai' ? 'text-white' : 'text-indigo-600'} />} 
              label="Analisis AI" 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')} 
              collapsed={!isSidebarOpen}
              special
            />
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">JS</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Jaya Sakti</p>
                <p className="text-[10px] text-slate-400 font-medium">Pemilik Toko</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"
          >
            {isSidebarOpen ? <ChevronRight className="rotate-180" size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content dengan efek glassmorphism pada header */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc]">
        <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-10 py-5 z-40 flex justify-between items-center transition-all duration-300">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tabTitles[activeTab]}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-slate-500 text-xs font-medium">Status Sistem: <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Normal</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari produk, transaksi..." 
                className="pl-12 pr-6 py-2.5 bg-slate-100/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 w-80 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                <Bell size={20} />
                {stats.lowStockCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && <Dashboard stats={stats} products={products} transactions={transactions} onTabChange={setActiveTab} />}
          {activeTab === 'inventory' && <InventoryList products={products} onAddProduct={addProduct} onUpdateStock={updateStock} />}
          {activeTab === 'suppliers' && <SupplierList suppliers={suppliers} onAddSupplier={addSupplier} />}
          {activeTab === 'history' && <TransactionHistory transactions={transactions} />}
          {activeTab === 'today' && <TodayTransactions transactions={transactions} products={products} />}
          {activeTab === 'reports' && <ReportGenerator products={products} transactions={transactions} suppliers={suppliers} />}
          {activeTab === 'ai' && <AIInsights products={products} transactions={transactions} suppliers={suppliers} />}
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
  special?: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, collapsed, special, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
      active 
        ? special 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
          : 'bg-white text-indigo-700 font-bold shadow-md shadow-slate-200/50' 
        : special
          ? 'bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/50'
          : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
    }`}
  >
    <div className={`transition-transform duration-300 group-hover:scale-110 ${active && !special && 'text-indigo-600'}`}>
      {icon}
    </div>
    {!collapsed && (
      <span className="text-sm tracking-tight font-semibold flex-1 text-left">{label}</span>
    )}
    {!collapsed && badge && badge > 0 && (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
        {badge}
      </span>
    )}
    {active && !collapsed && !special && (
      <div className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-r-full"></div>
    )}
    {collapsed && (
       <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
       </div>
    )}
  </button>
);
