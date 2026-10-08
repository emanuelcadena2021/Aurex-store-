import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
  <div class="auth">
    <section class="brand"><a routerLink="/" class="logo">Aurex<span>Store</span></a><p>Tu tienda, en un solo lugar.</p><div>🛍️</div></section>
    <section class="form">
      <a routerLink="/">← Volver al inicio</a>
      <div class="box">
        <small>BIENVENIDO</small><h1>Iniciar sesión</h1><p>Ingresa a tu cuenta para continuar.</p>
        <label>Correo electrónico</label><input type="email" placeholder="tucorreo@email.com">
        <label>Contraseña</label><input type="password" placeholder="Ingresa tu contraseña">
        <button (click)="visual()">Iniciar sesión</button>
        <p class="center">¿No tienes una cuenta? <a routerLink="/registro">Regístrate</a></p>
      </div>
    </section>
  </div>`
})
export class LoginComponent {
  visual() { alert('Login visual. La autenticación se implementará en otro taller.'); }
}
