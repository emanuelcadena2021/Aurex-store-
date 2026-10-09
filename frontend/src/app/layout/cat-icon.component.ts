import { Component, input } from '@angular/core';

/** Ícono por categoría (los mismos trazos SVG de la página de Shopify). */
@Component({
  selector: 'app-cat-icon',
  standalone: true,
  host: { style: 'display:contents' },
  template: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    @switch (cat()) {
      @case ('Audio') { <path d="M4 13a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-1v-7h3M4 13v5a2 2 0 0 0 2 2h1v-7H4"/> }
      @case ('Gaming') { <rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13h.01"/> }
      @case ('Computación') { <rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M1 20h22"/> }
      @case ('Celulares') { <rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/> }
      @default { <circle cx="12" cy="12" r="6"/><path d="M9 3h6l1 4M9 21h6l1-4M8 7 9 3M8 17l1 4"/> }
    }
  </svg>`
})
export class CatIconComponent {
  cat = input<string>('Accesorios');
}
