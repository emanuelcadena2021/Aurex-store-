import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL, AuthUser } from './models';

const STORAGE_KEY = 'aurex-user';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptsMarketing: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/Auth`;

  user = signal<AuthUser | null>(this.load());

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(user => this.save(user)));
  }

  register(data: RegisterData): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, data)
      .pipe(tap(user => this.save(user)));
  }

  recover(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/recover`, { email });
  }

  reset(token: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/reset`, { token, password })
      .pipe(tap(user => this.save(user)));
  }

  logout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    this.user.set(null);
  }

  get token() {
    return this.user()?.token ?? null;
  }

  private save(user: AuthUser) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
    this.user.set(user);
  }

  private load(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw) as AuthUser;
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      if (!user.firstName || payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}

/** Convierte el error de la API en un mensaje para mostrar en el formulario. */
export function apiError(err: any, fallback: string): string {
  if (err?.status === 0) return 'No se pudo conectar con la API. Verifica que esté ejecutándose en http://localhost:5000.';
  if (err?.error?.message) return err.error.message;
  const errors = err?.error?.errors;
  if (errors) return (Object.values(errors).flat() as string[]).join(' ');
  return fallback;
}
