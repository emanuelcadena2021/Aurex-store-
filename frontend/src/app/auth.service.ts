import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  token: string;
  name: string;
  email: string;
  role: string;
}

const STORAGE_KEY = 'aurex-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/Auth';

  user = signal<AuthUser | null>(this.load());

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(user => this.save(user)));
  }

  register(name: string, email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(tap(user => this.save(user)));
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.user.set(null);
  }

  get token() {
    return this.user()?.token ?? null;
  }

  private save(user: AuthUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  private load(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    const payload = JSON.parse(atob(user.token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  }
}
