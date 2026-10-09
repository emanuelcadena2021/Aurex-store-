import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { API_URL, CartLine, Order, Product, Settings } from './models';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private http = inject(HttpClient);
  private settings$?: Observable<Settings>;

  products(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/Products`);
  }

  product(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/Products/${id}`);
  }

  settings(): Observable<Settings> {
    return this.settings$ ??= this.http.get<Settings>(`${API_URL}/Settings`).pipe(shareReplay(1));
  }

  createOrder(customerName: string, address: string, lines: CartLine[]): Observable<Order> {
    return this.http.post<Order>(`${API_URL}/Orders`, {
      customerName,
      address,
      items: lines.map(l => ({ productId: l.id, quantity: l.qty }))
    });
  }

  myOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/Orders/mine`);
  }
}
