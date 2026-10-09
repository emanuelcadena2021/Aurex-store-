import { Injectable, computed, signal } from '@angular/core';
import { CartLine, Product } from './models';

const STORAGE_KEY = 'aurex-cart';

/** Carrito guardado en el navegador, igual que en la página de Shopify (localStorage "aurex-cart"). */
@Injectable({ providedIn: 'root' })
export class CartService {
  lines = signal<CartLine[]>(this.load());
  count = computed(() => this.lines().reduce((a, l) => a + l.qty, 0));
  total = computed(() => this.lines().reduce((a, l) => a + l.price * l.qty, 0));

  add(p: Product, qty = 1) {
    const lines = this.lines();
    const found = lines.find(l => l.id === p.id);
    this.update(found
      ? lines.map(l => l.id === p.id ? { ...l, qty: l.qty + qty } : l)
      : [...lines, { id: p.id, name: p.name, price: p.price, qty, imageUrl: p.imageUrl, stock: p.stock }]);
  }

  setQty(id: number, qty: number) {
    this.update(qty <= 0
      ? this.lines().filter(l => l.id !== id)
      : this.lines().map(l => l.id === id ? { ...l, qty } : l));
  }

  inc(id: number) { this.setQty(id, (this.lines().find(l => l.id === id)?.qty ?? 0) + 1); }
  dec(id: number) { this.setQty(id, (this.lines().find(l => l.id === id)?.qty ?? 0) - 1); }
  clear() { this.update([]); }

  private update(lines: CartLine[]) {
    this.lines.set(lines);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }

  private load(): CartLine[] {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}
