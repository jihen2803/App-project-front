import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { SessionService } from '../services/session.service';
import { AuthApiService } from '../services/auth-api.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionService = inject(SessionService);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  if (shouldSkipAuth(request)) {
    return next(request);
  }

  const token = sessionService.getAccessToken();
  if (!token) {
    return next(request);
  }

  return next(attachToken(request, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized && !sessionService.isAuthenticated()) {
        sessionService.clearSession();
        router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      if (error.status === HttpStatusCode.Unauthorized && sessionService.isAuthenticated()) {
        return from(authApi.autoRefreshToken()).pipe(
          switchMap((refreshed) => {
            if (!refreshed) {
              sessionService.clearSession();
              router.navigate(['/auth/login']);
              return throwError(() => error);
            }

            const newToken = sessionService.getAccessToken();
            return next(attachToken(request, newToken));
          }),
          catchError((refreshError) => {
            sessionService.clearSession();
            router.navigate(['/auth/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

function shouldSkipAuth(request: HttpRequest<unknown>): boolean {
  return /\/api\/auth\/(login|register|refresh|logout)$/.test(request.url);
}

function attachToken(request: HttpRequest<unknown>, token: string | null) {
  if (!token) {
    return request;
  }
  
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
