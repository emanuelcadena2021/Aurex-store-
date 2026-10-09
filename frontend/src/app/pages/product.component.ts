import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { StoreService } from '../core/store.service';
import { ToastService } from '../core/toast.service';
import { Product, fmt } from '../core/models';
import { CatIconComponent } from '../layout/cat-icon.component';

/** Página de producto (templates/product.liquid). */
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, RouterLink, CatIconComponent],
  template: `
  <main class="wrap page">
    @if (product(); as p) {
      <div class="pdp">
        @if (p.imageUrl) {
          <img [src]="p.imageUrl" [alt]="p.name">
        } @else {
          <div class="art" style="border-radius:16px"><app-cat-icon [cat]="p.category" /></div>
        }
        <div>
          <div class="eyebrow">{{ p.category }}</div>
          <h1>{{ p.name }}</h1>
          <div class="price" style="font-size:28px;color:var(--ax-red2)">{{ fmt(p.price) }}</div>
          <div class="rte" style="margin:16px 0">{{ p.description }}</div>
          <p class="stock" style="margin:0 0 16px">{{ p.stock > 0 ? p.stock + ' disponibles' : 'Sin unidades' }}</p>
          <form (ngSubmit)="add(p)" style="display:flex;gap:10px;flex-wrap:wrap">
            <input type="number" name="quantity" [(ngModel)]="qty" min="1" [max]="p.stock" aria-label="Cantidad" style="width:80px">
            <button class="btn red" type="submit" [disabled]="p.stock < 1">{{ p.stock > 0 ? 'Agregar al carrito' : 'Agotado' }}</button>
          </form>
        </div>
      </div>
    } @else if (notFound()) {
      <h1>Producto no encontrado</h1>
      <p class="rte">El producto que buscas no existe.</p>
      <a class="btn red" routerLink="/">Volver a la tienda</a>
    }
  </main>`
})
export class ProductComponent {
  private cart = inject(CartService);
  private toast = inject(ToastService);
  fmt = fmt;
  product = signal<Product | null>(null);
  notFound = signal(false);
  qty = 1;

  constructor() {
    const id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
    inject(StoreService).product(id).subscribe({
      next: p => this.product.set(p),
      error: () => this.notFound.set(true)
    });
  }

  add(p: Product) {
    const inCart = this.cart.lines().find(l => l.id === p.id)?.qty ?? 0;
    const qty = Math.max(1, Math.floor(this.qty || 1));
    if (inCart + qty > p.stock) { this.toast.show(`Solo hay ${p.stock} disponibles`); return; }
    this.cart.add(p, qty);
    this.toast.show('Agregado al carrito');
  }
}
