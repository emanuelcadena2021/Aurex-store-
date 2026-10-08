import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { Product } from './product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  template: `
  <header class="navbar">
    <a class="logo" routerLink="/">Aurex<span>Store</span></a>
    <nav>
      <a routerLink="/">Inicio</a>
      <a href="#productos">Productos</a>
      <a href="#productos">Categorías</a>
    </nav>
    <div class="right">
      <input [(ngModel)]="search" placeholder="Buscar productos...">
      @if (auth.user(); as u) {
        <span class="user">Hola, {{ u.name }}</span>
        <button class="logout" (click)="auth.logout()">Salir</button>
      } @else {
        <a routerLink="/login" class="user">👤 Ingresar</a>
      }
    </div>
  </header>

  <main>
    <section class="hero">
      <div>
        <small>TU TIENDA EN UN SOLO LUGAR</small>
        <h1>Todo lo que necesitas,<br><b>en un solo lugar.</b></h1>
        <p>Descubre productos destacados con excelente calidad y precio.</p>
        <a class="button" href="#productos">Ver productos</a>
      </div>
      <div class="hero-icons">🛍️ 💻 🎧</div>
    </section>

    <section id="productos" class="products">
      <div class="heading">
        <div><small>NUESTRO CATÁLOGO</small><h2>Productos destacados</h2></div>
        <span>{{ filteredProducts.length }} productos</span>
      </div>

      <p *ngIf="loading">Cargando productos desde MySQL...</p>
      <p class="error" *ngIf="error">{{ error }}</p>

      <div class="grid">
        <article class="card" *ngFor="let p of filteredProducts">
          <div class="image"><img [src]="p.imageUrl" [alt]="p.name"></div>
          <div class="info">
            <h3>{{ p.name }}</h3>
            <p>{{ p.description }}</p>
            <strong>{{ p.price | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
            <small>✓ {{ p.stock }} disponibles</small>
            <button>Ver producto</button>
          </div>
        </article>
      </div>
    </section>
  </main>
  <footer>© 2026 Aurex Store · Taller 3 Frontend Angular</footer>
  `
})
export class HomeComponent {
  private service = inject(ProductService);
  auth = inject(AuthService);
  products: Product[] = [];
  search = '';
  loading = true;
  error = '';

  constructor() {
    this.service.getProducts().subscribe({
      next: data => { this.products = data; this.loading = false; },
      error: () => { this.error = 'No se pudo conectar con la API. Verifica que la API esté ejecutándose y que MySQL esté activo.'; this.loading = false; }
    });
  }

  get filteredProducts() {
    const term = this.search.toLowerCase().trim();
    return this.products.filter(p => p.name.toLowerCase().includes(term));
  }
}
