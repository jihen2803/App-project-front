import { Injectable, signal, computed } from '@angular/core';

export type SessionUser = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

const STORAGE_KEY = 'atelier-noir-session';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly currentUserSignal = signal<SessionUser | null>(this.readFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  
  readonly isAuthenticated = computed(() => {
    const user = this.currentUserSignal();
    if (!user?.refreshToken) return false;

    return !this.isRefreshTokenExpired();
  });

  setSession(session: SessionUser): void {
    this.currentUserSignal.set(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  updateTokens(accessToken: string, accessTokenExpiresAt: string, refreshToken?: string, refreshTokenExpiresAt?: string): void {
    const current = this.currentUserSignal();
    if (current) {
      this.setSession({
        ...current,
        accessToken,
        accessTokenExpiresAt,
        refreshToken: refreshToken ?? current.refreshToken,
        refreshTokenExpiresAt: refreshTokenExpiresAt ?? current.refreshTokenExpiresAt,
      });
    }
  }

  getAccessToken(): string | null {
    return this.currentUserSignal()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.currentUserSignal()?.refreshToken ?? null;
  }

  getRefreshTokenExpiresAt(): string | null {
    return this.currentUserSignal()?.refreshTokenExpiresAt ?? null;
  }

  getAccessTokenExpiresAt(): string | null {
    return this.currentUserSignal()?.accessTokenExpiresAt ?? null;
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.roles.includes(role) ?? false;
  }

  isAccessTokenExpired(): boolean {
    const accessTokenExpiresAt = this.currentUserSignal()?.accessTokenExpiresAt;
    if (!accessTokenExpiresAt) return true;

    return new Date(accessTokenExpiresAt) <= new Date();
  }

  isRefreshTokenExpired(): boolean {
    const refreshTokenExpiresAt = this.currentUserSignal()?.refreshTokenExpiresAt;
    if (!refreshTokenExpiresAt) return true;

    return new Date(refreshTokenExpiresAt) <= new Date();
  }

  private readFromStorage(): SessionUser | null {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    try {
      const session = JSON.parse(rawValue) as SessionUser;

      if (!session.refreshToken || !session.accessToken) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      if (session.refreshTokenExpiresAt && new Date(session.refreshTokenExpiresAt) <= new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return session;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
