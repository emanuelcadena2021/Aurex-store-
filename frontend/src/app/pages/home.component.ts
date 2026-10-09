import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { CartService } from '../core/cart.service';
import { StoreService } from '../core/store.service';
import { ToastService } from '../core/toast.service';
import { Order, Product, Settings, fmt } from '../core/models';
import { CatIconComponent } from '../layout/cat-icon.component';
import { CheckoutFormComponent } from '../layout/checkout-form.component';

/**
 * Portada: copia de sections/aurex-store.liquid + sections/sobre-nosotros.liquid
 * (rama shopify-original). Los productos vienen de MySQL y los textos de la tabla store_settings.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, CatIconComponent, CheckoutFormComponent],
  template: `
  <header class="hdr"><div class="wrap bar">
    <a class="logo" href="#top" (click)="scrollTo($event, 'top')">AUREX<b>STORE</b></a>
    <nav class="nav" aria-label="Menú principal">
      <a href="#top" class="on" (click)="scrollTo($event, 'top')">Inicio</a>
      <a href="#tienda" (click)="scrollTo($event, 'tienda')">Productos</a>
      <a href="#tienda" (click)="ofertas($event)">Ofertas</a>
    </nav>
    <div class="search"><input id="q" type="search" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Buscar productos..." aria-label="Buscar productos"></div>
    @if (auth.user(); as u) {
      <a class="hello" routerLink="/cuenta">Hola, {{ u.firstName || 'cliente' }}</a>
    }
    <a class="iconbtn" [routerLink]="auth.user() ? '/cuenta' : '/cuenta/login'" [attr.aria-label]="auth.user() ? 'Mi cuenta' : 'Iniciar sesión o registrarse'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></a>
    <button class="iconbtn cartbtn" id="openCart" aria-label="Carrito" (click)="drawer.set(true)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span id="cc">{{ cart.count() }}</span></button>
  </div></header>

  <section class="hero" [class.has-img]="s()['hero_image']" id="top">
    @if (s()['hero_image']) {
      <img class="hero-bg" [src]="s()['hero_image']" alt="" fetchpriority="high">
    }
    <div class="wrap">
      <div class="hero-copy">
        <div class="eyebrow line">{{ s()['eyebrow'] }}</div>
        <h1><span class="t1">{{ s()['title'] }}</span> <em>{{ s()['title_red'] }}</em>@if (s()['title_script']) { <span class="script">{{ s()['title_script'] }}</span>}</h1>
        <p>{{ s()['text'] }}</p>
        <div class="cta">
          <a class="btn red pill" href="#tienda" (click)="scrollTo($event, 'tienda')">{{ s()['button'] }} <span aria-hidden="true">→</span></a>
          @if (s()['button2']) { <button class="btn ghost pill" id="ofertas" (click)="ofertas($event)">{{ s()['button2'] }}</button> }
        </div>
      </div>
    </div>
    <div class="wrap badges">
      <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg></i><b>Compra segura</b><small>Tus datos protegidos</small></div>
      <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg></i><b>Envíos a Colombia</b><small>Compra desde cualquier lugar</small></div>
      <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/></svg></i><b>Atención al cliente</b><small>Estamos para ayudarte</small></div>
      <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg></i><b>Pagos confiables</b><small>Múltiples métodos de pago</small></div>
    </div>
  </section>

  <main class="wrap shop" id="tienda">
    <div class="head"><div><div class="eyebrow">Catálogo</div><h2>{{ s()['catalog_title'] || 'Productos destacados' }}</h2></div><div class="count" id="count">{{ filtered().length }} productos</div></div>
    <div class="chips" id="chips">
      @for (c of cats(); track c) {
        <button class="chip" [attr.aria-pressed]="c === cat()" (click)="cat.set(c)">{{ c }}</button>
      }
    </div>
    @if (error()) { <p class="empty">{{ error() }}</p> }
    <div class="grid" id="grid">
      @for (p of filtered(); track p.id) {
        <article class="card">
          <div class="art">
            @if (p.imageUrl) { <img [src]="p.imageUrl" alt="" loading="lazy"> }
            <span class="cat">{{ p.category }}</span>
            @if (p.stock < 5) { <span class="low">Últimas unidades</span> }
            <app-cat-icon [cat]="p.category" />
          </div>
          <div class="info"><h3><a [routerLink]="['/producto', p.id]">{{ p.name }}</a></h3><p>{{ p.description }}</p>
            <div class="row"><span class="price">{{ fmt(p.price) }}</span><span class="stock">{{ p.stock > 0 ? p.stock + ' disp.' : 'Agotado' }}</span></div>
            <button class="add" [disabled]="p.stock < 1" (click)="add(p)">{{ p.stock > 0 ? 'Agregar al carrito' : 'Agotado' }}</button></div>
        </article>
      } @empty {
        @if (!loading()) { <p class="empty">No hay productos con ese nombre.</p> }
      }
    </div>
  </main>

  <section class="ax-about" id="nosotros">
    <div class="wrap">
      <div class="ax-about-grid">
        <div class="ax-about-media">
          @if (s()['about_image']) { <img [src]="s()['about_image']" [alt]="s()['about_title']" loading="lazy"> } @else { <span class="ph">AUREX</span> }
        </div>
        <div>
          @if (s()['about_eyebrow']) { <div class="eyebrow">{{ s()['about_eyebrow'] }}</div> }
          <h2>{{ s()['about_title'] + ' ' }}@if (s()['about_title_red']) {<em>{{ s()['about_title_red'] }}</em>}</h2>
          <div class="rte" [innerHTML]="s()['about_text']"></div>
          @if (values().length) {
            <div class="values">
              @for (v of values(); track $index) { <div class="value"><strong>{{ v.number }}</strong><span>{{ v.label }}</span></div> }
            </div>
          }
          @if (waHref() && s()['whatsapp_button']) {
            <a class="wa-btn" [href]="waHref()" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3z"/></svg>{{ s()['whatsapp_button'] }}</a>
          }
          <div class="socials">
            @if (s()['instagram']) { <a [href]="s()['instagram']" target="_blank" rel="noopener">Instagram</a> }
            @if (s()['facebook']) { <a [href]="s()['facebook']" target="_blank" rel="noopener">Facebook</a> }
            @if (s()['tiktok']) { <a [href]="s()['tiktok']" target="_blank" rel="noopener">TikTok</a> }
          </div>
        </div>
      </div>

      <div class="contact">
        @if (s()['whatsapp']) {
          <a [href]="'https://api.whatsapp.com/send?phone=' + waNumber()" target="_blank" rel="noopener noreferrer"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 1.8 3.8 4 4.6l1.2-1.2 2 1-.5 1.6c-3.5.3-7.3-3.4-7-7l1.6-.5 1 2z"/></svg></i><b>WhatsApp</b><small>{{ s()['whatsapp'] }}</small></a>
        }
        @if (s()['email']) {
          <a [href]="'mailto:' + s()['email']"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></i><b>Correo</b><small>{{ s()['email'] }}</small></a>
        }
        @if (s()['address']) {
          <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></i><b>Ubicación</b><small>{{ s()['address'] }}</small></div>
        }
        @if (s()['hours']) {
          <div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></i><b>Horario</b><small>{{ s()['hours'] }}</small></div>
        }
      </div>
    </div>
  </section>

  @if (drawer()) {
    <div class="drawer" id="drawer" (click)="closeOnBackdrop($event)">
      <div class="panel" role="dialog" aria-label="Carrito">
        <h2>Tu carrito <button class="x" id="closeCart" aria-label="Cerrar" (click)="drawer.set(false)">×</button></h2>
        <div class="items" id="items">
          @if (placed(); as o) {
            <div class="done"><strong>Pedido confirmado</strong>Pedido #{{ o.id }}. Gracias, {{ o.customerName }}. Pagas al recibir.</div>
          } @else {
            @for (l of cart.lines(); track l.id) {
              <div class="item"><div><strong>{{ l.name }}</strong><br><small>{{ fmt(l.price) }} c/u</small></div>
                <div class="qty"><button (click)="cart.dec(l.id)" aria-label="Quitar uno">−</button>{{ l.qty }}<button (click)="cart.inc(l.id)" aria-label="Agregar uno">+</button></div></div>
            } @empty {
              <p class="empty">Tu carrito está vacío.</p>
            }
          }
        </div>
        @if (cart.count() > 0 && !placed()) {
          <div id="checkout">
            <div class="total"><span>Total</span><span>{{ fmt(cart.total()) }}</span></div>
            <app-checkout-form (done)="orderPlaced($event)" />
          </div>
        }
      </div>
    </div>
  }`
})
export class HomeComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private store = inject(StoreService);
  private toast = inject(ToastService);
  private el = inject(ElementRef<HTMLElement>);
  fmt = fmt;

  products = signal<Product[]>([]);
  s = signal<Settings>({});
  loading = signal(true);
  error = signal('');
  cat = signal('Todos');
  q = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('q') ?? '');
  drawer = signal(false);
  placed = signal<Order | null>(null);

  cats = computed(() => ['Todos', ...new Set(this.products().map(p => p.category))]);
  filtered = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.products().filter(p => (this.cat() === 'Todos' || p.category === this.cat()) && p.name.toLowerCase().includes(q));
  });
  values = computed<{ number: string; label: string }[]>(() => {
    try { return JSON.parse(this.s()['about_values'] || '[]'); } catch { return []; }
  });
  waNumber = computed(() => (this.s()['whatsapp'] || '').replace(/[\s+\-()]/g, ''));
  waHref = computed(() => {
    if (this.s()['whatsapp_link']) return this.s()['whatsapp_link'];
    if (!this.waNumber()) return '';
    const msg = this.s()['whatsapp_message'];
    return `https://api.whatsapp.com/send?phone=${this.waNumber()}` + (msg ? `&text=${encodeURIComponent(msg)}` : '');
  });

  constructor() {
    this.store.settings().subscribe({ next: s => this.s.set(s), error: () => {} });
    this.loadProducts();
  }

  loadProducts() {
    this.store.products().subscribe({
      next: data => { this.products.set(data); this.loading.set(false); this.error.set(''); },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo conectar con la API. Verifica que la API esté ejecutándose y que MySQL esté activo.');
      }
    });
  }

  ngAfterViewInit() {
    if (this.q()) setTimeout(() => this.find('tienda')?.scrollIntoView());
  }

  add(p: Product) {
    const inCart = this.cart.lines().find(l => l.id === p.id)?.qty ?? 0;
    if (inCart >= p.stock) { this.toast.show(`Solo hay ${p.stock} disponibles`); return; }
    this.cart.add(p);
    this.placed.set(null);
    this.toast.show('Agregado al carrito');
  }

  orderPlaced(order: Order) {
    this.placed.set(order);
    this.loadProducts();
  }

  closeOnBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) this.drawer.set(false);
  }

  ofertas(e: Event) {
    this.cat.set('Todos');
    this.scrollTo(e, 'tienda');
  }

  scrollTo(e: Event, id: string) {
    e.preventDefault();
    this.find(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  private find(id: string): HTMLElement | null {
    return this.el.nativeElement.querySelector('#' + id);
  }
}
