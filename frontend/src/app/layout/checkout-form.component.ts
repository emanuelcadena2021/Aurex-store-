import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, apiError } from '../core/auth.service';
import { CartService } from '../core/cart.service';
import { StoreService } from '../core/store.service';
import { Order } from '../core/models';

/** Formulario "Confirmar pedido" (pago contra entrega). Guarda el pedido en MySQL vía la API. */
@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [FormsModule],
  template: `
  @if (error) { <div class="alert err">{{ error }}</div> }
  <form class="form" (ngSubmit)="submit()">
    <input name="nombre" [(ngModel)]="name" required placeholder="Nombre completo" aria-label="Nombre completo">
    <input name="dir" [(ngModel)]="address" required placeholder="Dirección de entrega" aria-label="Dirección de entrega">
    <button class="btn red" type="submit" [disabled]="sending">{{ sending ? 'Enviando...' : 'Confirmar pedido' }}</button>
  </form>`
})
export class CheckoutFormComponent {
  private store = inject(StoreService);
  private cart = inject(CartService);
  done = output<Order>();

  name = '';
  address = '';
  sending = false;
  error = '';

  constructor() {
    const u = inject(AuthService).user();
    if (u) this.name = `${u.firstName} ${u.lastName}`.trim();
  }

  submit() {
    if (!this.name.trim() || !this.address.trim()) {
      this.error = 'Escribe tu nombre y la dirección de entrega.';
      return;
    }
    this.sending = true;
    this.error = '';
    this.store.createOrder(this.name, this.address, this.cart.lines()).subscribe({
      next: order => { this.cart.clear(); this.sending = false; this.done.emit(order); },
      error: err => { this.sending = false; this.error = apiError(err, 'No se pudo crear el pedido.'); }
    });
  }
}
