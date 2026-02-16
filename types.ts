
export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  description: string;
  updatedAt: string;
  supplierId?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
  quantity: number;
  date: string;
  note: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  totalTransactions: number;
  totalSuppliers: number;
  todayRevenue: number;
}
