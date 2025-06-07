import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Skip for login and register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  if (token) {
    // Clone the request and add auth header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Clear storage and redirect to login
          localStorage.clear();
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
        }
        return throwError(() => error);
      })
    );
  }

  // No token found, redirect to login
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url },
  });
  return throwError(() => new Error('No token found'));
};
