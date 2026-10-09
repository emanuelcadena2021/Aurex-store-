import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { Order, fmt } from '../core/models';
import { CatIconComponent } from '../layout/cat-icon.component';
import { CheckoutFormComponent } from '../layout/checkout-form.component';

/** Página del carrito (templates/cart.liquid). */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, RouterLink, CatIconComponent, CheckoutFormComponent],
  template: `
  <main class="wrap page">
    <h1>Tu carrito</h1>
    @if (placed(); as o) {
      <div class="done"><strong>Pedido confirmado</strong>Pedido #{{ o.id }}. Gracias, {{ o.customerName }}. Pagas al recibir.</div>
      <a class="btn red" routerLink="/">Seguir comprando</a>
    } @else if (cart.count() > 0) {
      @for (l of cart.lines(); track l.id) {
        <div class="cart-row">
          @if (l.imageUrl) { <img [src]="l.imageUrl" alt="" width="80" height="80"> } @else { <div class="art" style="width:80px;border-radius:10px"><app-cat-icon /></div> }
          <div><a [routerLink]="['/producto', l.id]"><strong>{{ l.name }}</strong></a><br><small style="color:var(--ax-muted)">{{ fmt(l.price) }} c/u</small></div>
          <input type="number" [ngModel]="l.qty" (ngModelChange)="cart.setQty(l.id, +$event)" min="0" [max]="l.stock" aria-label="Cantidad" style="width:70px">
          <span class="price">{{ fmt(l.price * l.qty) }}</span>
        </div>
      }
      <div class="total"><span>Total</span><span>{{ fmt(cart.total()) }}</span></div>
      @if (checkout()) {
        <div style="max-width:420px"><app-checkout-form (done)="placed.set($event)" /></div>
      } @else {
        <div class="cta"><a class="btn ghost" routerLink="/">Seguir comprando</a><button class="btn red" type="button" (click)="checkout.set(true)">Finalizar compra</button></div>
      }
    } @else {
      <p class="empty">Tu carrito está vacío.</p><a class="btn red" routerLink="/">Ver productos</a>
    }
  </main>`
})
export class CartComponent {
  cart = inject(CartService);
  fmt = fmt;
  checkout = signal(false);
  placed = signal<Order | null>(null);
}
