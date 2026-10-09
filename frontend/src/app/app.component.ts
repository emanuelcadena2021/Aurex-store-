import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ToastService } from './core/toast.service';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

/** Equivale a layout/theme.liquid: encabezado (excepto en la portada), contenido y pie. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
  <div id="aurex" [class.is-home]="isHome()">
    @if (!isHome()) { <app-header /> }
    <router-outlet />
    <app-footer />
    @if (toast.message()) { <div class="toast" role="status">{{ toast.message() }}</div> }
  </div>`
})
export class AppComponent {
  toast = inject(ToastService);
  private router = inject(Router);
  isHome = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split(/[?#]/)[0] === '/')
    ),
    { initialValue: location.pathname === '/' }
  );
}
