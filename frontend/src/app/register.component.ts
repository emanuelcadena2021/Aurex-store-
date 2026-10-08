import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
  <div class="auth">
    <section class="brand"><a routerLink="/" class="logo">Aurex<span>Store</span></a><p>Tu tienda, en un solo lugar.</p><div>🛍️</div></section>
    <section class="form">
      <a routerLink="/login">← Volver al login</a>
      <div class="box">
        <small>CREAR CUENTA</small><h1>Crear cuenta</h1><p>Completa la información para registrarte.</p>
        <label>Nombre</label><input placeholder="Tu nombre completo">
        <label>Correo electrónico</label><input type="email" placeholder="tucorreo@email.com">
        <label>Contraseña</label><input type="password" placeholder="Contraseña">
        <label>Confirmar contraseña</label><input type="password" placeholder="Repite la contraseña">
        <button (click)="visual()">Registrarse</button>
        <p class="center">¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </div>
    </section>
  </div>`
})
export class RegisterComponent {
  visual() { alert('Registro visual. El registro real se implementará en otro taller.'); }
}
