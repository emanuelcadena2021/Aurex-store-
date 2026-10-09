import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).user() ? true : inject(Router).createUrlTree(['/cuenta/login']);

export const guestGuard: CanActivateFn = () =>
  inject(AuthService).user() ? inject(Router).createUrlTree(['/cuenta']) : true;
