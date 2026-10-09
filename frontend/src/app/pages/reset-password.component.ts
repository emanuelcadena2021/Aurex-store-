import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, apiError } from '../core/auth.service';

/** Crear contraseña nueva desde el enlace de recuperación (templates/customers/reset_password.liquid). */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <main class="auth">
    <div class="auth-card">
      <h1>Nueva contraseña</h1>
      <p class="sub">Escribe la contraseña nueva para tu cuenta.</p>
      <form (ngSubmit)="submit()">
        @if (error()) { <div class="alert err">{{ error() }}</div> }
        <div class="field">
          <label for="NewPassword">Contraseña nueva</label>
          <input type="password" id="NewPassword" name="password" [(ngModel)]="password" autocomplete="new-password" minlength="5" placeholder="Mínimo 5 caracteres" required>
        </div>
        <div class="field">
          <label for="NewConfirm">Confirmar contraseña</label>
          <input type="password" id="NewConfirm" name="confirm" [(ngModel)]="confirm" autocomplete="new-password" placeholder="Repite la contraseña" required>
        </div>
        <button class="btn red" type="submit" [disabled]="busy()">Guardar contraseña</button>
      </form>
      <p class="auth-foot"><a routerLink="/cuenta/login">Volver a iniciar sesión</a></p>
    </div>
  </main>`
})
export class ResetPasswordComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';
  busy = signal(false);
  error = signal(this.token ? '' : 'El enlace no es válido. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".');
  password = '';
  confirm = '';

  submit() {
    if (this.password.length < 5) { this.error.set('La contraseña debe tener mínimo 5 caracteres.'); return; }
    if (this.password !== this.confirm) { this.error.set('Las contraseñas no coinciden.'); return; }
    this.busy.set(true);
    this.auth.reset(this.token, this.password).subscribe({
      next: () => this.router.navigateByUrl('/cuenta'),
      error: err => { this.busy.set(false); this.error.set(apiError(err, 'No se pudo cambiar la contraseña.')); }
    });
  }
}
