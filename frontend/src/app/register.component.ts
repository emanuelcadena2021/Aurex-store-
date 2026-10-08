import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
  <div class="auth">
    <section class="brand"><a routerLink="/" class="logo">Aurex<span>Store</span></a><p>Tu tienda, en un solo lugar.</p><div>🛍️</div></section>
    <section class="form">
      <a routerLink="/login">← Volver al login</a>
      <form class="box" (ngSubmit)="submit()" #f="ngForm">
        <small>CREAR CUENTA</small><h1>Crear cuenta</h1><p>Completa la información para registrarte.</p>
        <label for="name">Nombre</label>
        <input id="name" name="name" required minlength="2" [(ngModel)]="name" placeholder="Tu nombre completo">
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required email [(ngModel)]="email" placeholder="tucorreo@email.com">
        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" required minlength="6" [(ngModel)]="password" placeholder="Mínimo 6 caracteres">
        <label for="confirm">Confirmar contraseña</label>
        <input id="confirm" name="confirm" type="password" required [(ngModel)]="confirm" placeholder="Repite la contraseña">
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="f.invalid || loading">{{ loading ? 'Creando cuenta...' : 'Registrarse' }}</button>
        <p class="center">¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </form>
    </section>
  </div>`
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = '';
  email = '';
  password = '';
  confirm = '';
  error = '';
  loading = false;

  submit() {
    if (this.password !== this.confirm) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e: HttpErrorResponse) => {
        this.error = e.status === 409 ? 'Ya existe una cuenta con ese correo.'
          : e.status === 400 ? 'Revisa los datos: correo válido y contraseña de al menos 6 caracteres.'
          : 'No se pudo conectar con la API.';
        this.loading = false;
      }
    });
  }
}
