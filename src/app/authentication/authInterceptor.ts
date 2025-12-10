import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  const token = authService.getToken();

  if (token && authService.isTokenExpired()) {
    alert('Token has been expired. Please log in again.');

    authService.logout();
    router.navigate(['/auth'], { replaceUrl: true });

    return throwError(() => new Error('TOKEN EXPIRED'));
  }

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && token) {
        alert('Token has been expired. Please log in again.');

        authService.logout();
        router.navigate(['/auth'], { replaceUrl: true });
        return throwError(() => err);
      }

      return throwError(() => err);
    })
  );
};
