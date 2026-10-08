import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
  <div class="auth">
    <section class="brand"><a routerLink="/" class="logo">Aurex<span>Store</span></a><p>Tu tienda, en un solo lugar.</p><div>🛍️</div></section>
    <section class="form">
      <a routerLink="/">← Volver al inicio</a>
      <form class="box" (ngSubmit)="submit()" #f="ngForm">
        <small>BIENVENIDO</small><h1>Iniciar sesión</h1><p>Ingresa a tu cuenta para continuar.</p>
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required email [(ngModel)]="email" placeholder="tucorreo@email.com">
        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" required [(ngModel)]="password" placeholder="Ingresa tu contraseña">
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="f.invalid || loading">{{ loading ? 'Ingresando...' : 'Iniciar sesión' }}</button>
        <p class="center">¿No tienes una cuenta? <a routerLink="/registro">Regístrate</a></p>
      </form>
    </section>
  </div>`
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  loading = false;

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e: HttpErrorResponse) => {
        this.error = e.status === 401 ? 'Correo o contraseña incorrectos.' : 'No se pudo conectar con la API.';
        this.loading = false;
      }
    });
  }
}
