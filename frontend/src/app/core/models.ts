export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

export interface AuthUser {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface OrderItem {
  productId: number | null;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  address: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CartLine {
  id: number;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
  stock: number;
}

/** Textos configurables de la página (tabla store_settings). */
export type Settings = Record<string, string>;

export const API_URL = 'http://localhost:5000/api';

/** Mismo formato de precio que la página de Shopify: $289.900 */
export const fmt = (n: number) => '$' + Number(n).toLocaleString('es-CO');
