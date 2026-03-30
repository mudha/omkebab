export interface User {
  userId: string;
  username: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE";
  branchId: string | null;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  createdAt: string;
  branchId: string;
  branch?: { name: string };
  salesMethod: "OFFLINE" | "SHOPEEFOOD" | "GRABFOOD";
  totalAmount: number;
  createdByUserId: string;
  createdBy?: { name: string; username?: string };
  items?: TransactionItem[];
}

export interface DashboardSummary {
  totalAmount: number;
  transactionCount: number;
  avgPerTransaction: number;
}

export interface BranchStat {
  branchId: string;
  branchName: string;
  totalAmount: number;
  count: number;
}

export interface MethodStat {
  method: string;
  totalAmount: number;
  count: number;
}

export interface TopProduct {
  name: string;
  totalQty: number;
  totalAmount: number;
}