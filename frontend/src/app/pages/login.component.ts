import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, apiError } from '../core/auth.service';

/** Iniciar sesión + recuperar contraseña (templates/customers/login.liquid). */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <main class="auth">
    <div class="auth-card">
      <nav class="auth-tabs" aria-label="Cuenta">
        <a routerLink="/cuenta/login" aria-current="page">Ingresar</a>
        <a routerLink="/cuenta/registro">Crear cuenta</a>
      </nav>

      @if (recover()) {
        <h1>Recuperar contraseña</h1>
        <p class="sub">Te enviaremos un correo para crear una contraseña nueva.</p>
        <form (ngSubmit)="sendRecover()">
          @if (recoverOk()) { <div class="alert ok">{{ recoverOk() }}</div> }
          @if (error()) { <div class="alert err">{{ error() }}</div> }
          <div class="field">
            <label for="RecoverEmail">Correo electrónico</label>
            <input type="email" id="RecoverEmail" name="email" [(ngModel)]="email" autocomplete="email" placeholder="tucorreo@email.com" required>
          </div>
          <button class="btn red" type="submit" [disabled]="busy()">Enviar enlace</button>
          <p class="auth-foot"><a href="#ingresar" (click)="show($event, false)">Volver a iniciar sesión</a></p>
        </form>
      } @else {
        <h1>Bienvenido de nuevo</h1>
        <p class="sub">Ingresa para ver tus pedidos y comprar más rápido.</p>
        <form (ngSubmit)="submit()">
          @if (error()) { <div class="alert err">{{ error() }}</div> }
          <div class="field">
            <label for="LoginEmail">Correo electrónico</label>
            <input type="email" id="LoginEmail" name="email" [(ngModel)]="email" autocomplete="email" placeholder="tucorreo@email.com" required>
          </div>
          <div class="field">
            <label for="LoginPassword">Contraseña</label>
            <div class="pw">
              <input [type]="showPw ? 'text' : 'password'" id="LoginPassword" name="password" [(ngModel)]="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              <button type="button" (click)="showPw = !showPw" aria-label="Mostrar u ocultar contraseña">{{ showPw ? 'Ocultar' : 'Ver' }}</button>
            </div>
          </div>
          <div class="auth-row"><a class="link" href="#recuperar" (click)="show($event, true)">¿Olvidaste tu contraseña?</a></div>
          <button class="btn red" type="submit" [disabled]="busy()">{{ busy() ? 'Ingresando...' : 'Iniciar sesión' }}</button>
        </form>
        <p class="auth-foot">¿No tienes cuenta? <a routerLink="/cuenta/registro">Regístrate gratis</a></p>
      }
    </div>
  </main>`
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  recover = signal(inject(ActivatedRoute).snapshot.fragment === 'recuperar');
  busy = signal(false);
  error = signal('');
  recoverOk = signal('');
  email = '';
  password = '';
  showPw = false;

  show(e: Event, recover: boolean) {
    e.preventDefault();
    this.error.set('');
    this.recoverOk.set('');
    this.recover.set(recover);
    history.replaceState(null, '', recover ? '/cuenta/login#recuperar' : '/cuenta/login');
  }

  submit() {
    if (!this.email || !this.password) { this.error.set('Escribe tu correo y tu contraseña.'); return; }
    this.busy.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/cuenta'),
      error: err => { this.busy.set(false); this.error.set(apiError(err, 'No se pudo iniciar sesión.')); }
    });
  }

  sendRecover() {
    if (!this.email) { this.error.set('Escribe tu correo.'); return; }
    this.busy.set(true);
    this.error.set('');
    this.auth.recover(this.email).subscribe({
      next: r => { this.busy.set(false); this.recoverOk.set(r.message); },
      error: err => { this.busy.set(false); this.error.set(apiError(err, 'No se pudo enviar el enlace.')); }
    });
  }
}
