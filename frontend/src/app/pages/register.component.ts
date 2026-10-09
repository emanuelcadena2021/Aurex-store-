import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterData, apiError } from '../core/auth.service';

/** Crear cuenta (templates/customers/register.liquid). */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <main class="auth">
    <div class="auth-card">
      <nav class="auth-tabs" aria-label="Cuenta">
        <a routerLink="/cuenta/login">Ingresar</a>
        <a routerLink="/cuenta/registro" aria-current="page">Crear cuenta</a>
      </nav>

      <h1>Crea tu cuenta</h1>
      <p class="sub">Guarda tus datos, sigue tus pedidos y recibe ofertas exclusivas.</p>

      <form (ngSubmit)="submit()">
        @if (error()) { <div class="alert err">{{ error() }}</div> }
        <div class="two">
          <div class="field">
            <label for="RegFirst">Nombre</label>
            <input id="RegFirst" name="firstName" [(ngModel)]="data.firstName" autocomplete="given-name" placeholder="Tu nombre" required>
          </div>
          <div class="field">
            <label for="RegLast">Apellido</label>
            <input id="RegLast" name="lastName" [(ngModel)]="data.lastName" autocomplete="family-name" placeholder="Tu apellido">
          </div>
        </div>
        <div class="field">
          <label for="RegEmail">Correo electrónico</label>
          <input type="email" id="RegEmail" name="email" [(ngModel)]="data.email" autocomplete="email" placeholder="tucorreo@email.com" required>
        </div>
        <div class="field">
          <label for="RegPassword">Contraseña</label>
          <div class="pw">
            <input [type]="showPw ? 'text' : 'password'" id="RegPassword" name="password" [(ngModel)]="data.password" autocomplete="new-password" minlength="5" placeholder="Mínimo 5 caracteres" required>
            <button type="button" (click)="showPw = !showPw" aria-label="Mostrar u ocultar contraseña">{{ showPw ? 'Ocultar' : 'Ver' }}</button>
          </div>
        </div>
        <div class="field">
          <label for="RegConfirm">Confirmar contraseña</label>
          <div class="pw">
            <input [type]="showConfirm ? 'text' : 'password'" id="RegConfirm" name="confirm" [(ngModel)]="confirm" autocomplete="new-password" placeholder="Repite la contraseña" required>
            <button type="button" (click)="showConfirm = !showConfirm" aria-label="Mostrar u ocultar contraseña">{{ showConfirm ? 'Ocultar' : 'Ver' }}</button>
          </div>
        </div>
        <label class="check"><input type="checkbox" name="acceptsMarketing" [(ngModel)]="data.acceptsMarketing"> Quiero recibir ofertas y novedades de Aurex Store.</label>
        <button class="btn red" type="submit" [disabled]="busy()">{{ busy() ? 'Creando cuenta...' : 'Crear cuenta' }}</button>
      </form>
      <p class="auth-foot">¿Ya tienes cuenta? <a routerLink="/cuenta/login">Inicia sesión</a></p>
    </div>
  </main>`
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  busy = signal(false);
  error = signal('');
  data: RegisterData = { firstName: '', lastName: '', email: '', password: '', acceptsMarketing: false };
  confirm = '';
  showPw = false;
  showConfirm = false;

  submit() {
    if (!this.data.firstName.trim() || !this.data.email.trim()) { this.error.set('Escribe tu nombre y tu correo.'); return; }
    if (this.data.password.length < 5) { this.error.set('La contraseña debe tener mínimo 5 caracteres.'); return; }
    if (this.data.password !== this.confirm) { this.error.set('Las contraseñas no coinciden.'); return; }
    this.busy.set(true);
    this.error.set('');
    this.auth.register(this.data).subscribe({
      next: () => this.router.navigateByUrl('/cuenta'),
      error: err => { this.busy.set(false); this.error.set(apiError(err, 'No se pudo crear la cuenta.')); }
    });
  }
}
