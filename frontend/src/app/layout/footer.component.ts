import { Component } from '@angular/core';

/** Pie de página (snippets/aurex-footer.liquid). */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<footer><div class="wrap"><span>© {{ year }} Aurex Store · Aurex Store</span><span>Pagos seguros · Pagas al recibir</span></div></footer>`
})
export class FooterComponent {
  year = new Date().getFullYear();
}
