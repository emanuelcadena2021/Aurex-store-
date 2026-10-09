import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** templates/404.liquid */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<main class="wrap page"><h1>Página no encontrada</h1><p class="rte">La página que buscas no existe.</p><a class="btn red" routerLink="/">Volver a la tienda</a></main>`
})
export class NotFoundComponent {}
