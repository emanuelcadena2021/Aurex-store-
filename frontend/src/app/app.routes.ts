import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { HomeComponent } from './pages/home.component';
import { ProductComponent } from './pages/product.component';
import { CartComponent } from './pages/cart.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { AccountComponent } from './pages/account.component';
import { ResetPasswordComponent } from './pages/reset-password.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Aurex Store' },
  { path: 'producto/:id', component: ProductComponent, title: 'Producto · Aurex Store' },
  { path: 'carrito', component: CartComponent, title: 'Tu carrito · Aurex Store' },
  { path: 'cuenta', component: AccountComponent, canActivate: [authGuard], title: 'Mi cuenta · Aurex Store' },
  { path: 'cuenta/login', component: LoginComponent, canActivate: [guestGuard], title: 'Iniciar sesión · Aurex Store' },
  { path: 'cuenta/registro', component: RegisterComponent, canActivate: [guestGuard], title: 'Crear cuenta · Aurex Store' },
  { path: 'cuenta/restablecer', component: ResetPasswordComponent, title: 'Nueva contraseña · Aurex Store' },
  // Rutas anteriores del taller
  { path: 'login', redirectTo: 'cuenta/login' },
  { path: 'registro', redirectTo: 'cuenta/registro' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada · Aurex Store' }
];
