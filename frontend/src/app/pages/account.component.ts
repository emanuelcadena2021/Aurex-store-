import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { StoreService } from '../core/store.service';
import { Order, fmt } from '../core/models';

/** Mi cuenta (templates/customers/account.liquid). */
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
  <main class="wrap acct">
    <div class="acct-head">
      <div>
        <p class="eyebrow">Mi cuenta</p>
        <h1>Hola, {{ auth.user()?.firstName || 'cliente' }}</h1>
      </div>
      <button class="btn ghost" type="button" (click)="logout()">Cerrar sesión</button>
    </div>

    <div class="acct-grid">
      <section class="box">
        <h2>Mis pedidos</h2>
        @if (orders().length > 0) {
          <table class="orders">
            <thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead>
            <tbody>
              @for (o of orders(); track o.id) {
                <tr>
                  <td>#{{ o.id }}<br><small style="color:var(--ax-muted)">{{ itemsText(o) }}</small></td>
                  <td>{{ o.createdAt | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ o.status }}</td>
                  <td>{{ fmt(o.total) }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else if (!loading()) {
          <p class="rte">Aún no tienes pedidos. <a routerLink="/" fragment="tienda" style="color:var(--ax-red2)">Ver productos</a></p>
        }
      </section>

      <aside class="box">
        <h2>Mis datos</h2>
        <p class="rte" style="margin:0 0 6px">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
        <p class="rte" style="margin:0 0 16px">{{ auth.user()?.email }}</p>
        @if (orders()[0]; as last) {
          <p class="rte" style="margin:0 0 16px"><b style="color:var(--ax-fg)">Última dirección de entrega</b><br>{{ last.address }}</p>
        }
        <a class="btn ghost" routerLink="/" fragment="tienda">Seguir comprando</a>
      </aside>
    </div>
  </main>`
})
export class AccountComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  fmt = fmt;
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor() {
    inject(StoreService).myOrders().subscribe({
      next: o => { this.orders.set(o); this.loading.set(false); },
      error: err => {
        this.loading.set(false);
        if (err.status === 401) { this.auth.logout(); this.router.navigateByUrl('/cuenta/login'); }
      }
    });
  }

  itemsText(o: Order) {
    return o.items.map(i => `${i.quantity} × ${i.productName}`).join(', ');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
