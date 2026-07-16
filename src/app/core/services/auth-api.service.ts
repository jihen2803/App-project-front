import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../models/auth.models';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly base = 'http://localhost:8080/api/auth';
  private refreshPromise: Promise<boolean> | null = null;

  isAuthenticated(): boolean {
    return this.session.isAuthenticated();
  }

  private persistAuthResponse(res: AuthResponse): void {
    this.session.setSession({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      tokenType: res.tokenType,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      roles: res.roles,
      accessTokenExpiresAt: res.accessTokenExpiresAt,
      refreshTokenExpiresAt: res.refreshTokenExpiresAt,
    });
  }

  private refreshExpiryFromNow(): string {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }

  private accessExpiryFromNow(): string {
    return new Date(Date.now() + 15 * 60 * 1000).toISOString();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, request).pipe(
      tap((res) => this.persistAuthResponse(res))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, request).pipe(
      tap((res) => this.persistAuthResponse(res))
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.session.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No token available to refresh'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<RefreshTokenResponse>(`${this.base}/refresh`, request).pipe(
      tap((res) => this.session.updateTokens(
        res.accessToken,
        this.accessExpiryFromNow(),
        res.refreshToken,
        this.refreshExpiryFromNow()
      ))
    );
  }

  autoRefreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise((resolve) => {
      this.refreshToken().subscribe({
        next: () => {
          this.refreshPromise = null;
          resolve(true);
        },
        error: () => {
          this.refreshPromise = null;
          this.session.clearSession();
          resolve(false);
        },
      });
    });

    return this.refreshPromise;
  }

  logout(): Observable<unknown> {
    const refreshToken = this.session.getRefreshToken();
    const request = refreshToken ? { refreshToken } : null;

    const logoutRequest$ = request
      ? this.http.post(`${this.base}/logout`, request)
      : of(null);

    return logoutRequest$.pipe(
      catchError(() => of(null)),
      tap(() => this.session.clearSession())
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<unknown> {
    return this.http.post(`${this.base}/change-password`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<unknown> {
    return this.http.post(`${this.base}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<unknown> {
    return this.http.post(`${this.base}/reset-password`, request);
  }
}
