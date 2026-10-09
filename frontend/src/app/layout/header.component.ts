import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';

/** Encabezado de las páginas internas (snippets/aurex-header.liquid). */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <header><div class="wrap bar">
    <a class="logo" routerLink="/">AUREX<b>STORE</b></a>
    <form class="search" role="search" (submit)="search($event)">
      <input name="q" type="search" [(ngModel)]="q" placeholder="Buscar productos..." aria-label="Buscar productos">
    </form>
    @if (auth.user(); as u) {
      <a class="btn ghost" routerLink="/cuenta">Hola, {{ u.firstName || 'cliente' }}</a>
    } @else {
      <a class="btn ghost" routerLink="/cuenta/login">Ingresar</a>
    }
    <a class="cartbtn" routerLink="/carrito">Carrito<span>{{ cart.count() }}</span></a>
  </div></header>`
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);
  q = '';

  search(e: Event) {
    e.preventDefault();
    this.router.navigate(['/'], { queryParams: { q: this.q.trim() || null }, fragment: 'tienda' });
  }
}
