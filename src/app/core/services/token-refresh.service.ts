import { Injectable, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private readonly authApi = inject(AuthApiService);
  private readonly session = inject(SessionService);
  private refreshSubscription: Subscription | null = null;
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

  startAutoRefresh(): void {
    // Stop any existing refresh timer
    this.stopAutoRefresh();

    // Start new refresh timer
    this.refreshSubscription = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkAndRefreshToken();
    });

    // Also do an initial check
    setTimeout(() => this.checkAndRefreshToken(), 1000);
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  private checkAndRefreshToken(): void {
    if (this.session.isAuthenticated() && this.session.isAccessTokenExpired()) {
      // Access token expired, refresh it with the long-lived refresh token
      this.authApi.autoRefreshToken().then(success => {
        if (!success) {
          // Refresh failed, stop auto refresh
          this.stopAutoRefresh();
        }
      });
    }
  }

  refreshNow(): Promise<boolean> {
    if (!this.session.isAuthenticated()) {
      return Promise.resolve(false);
    }
    return this.authApi.autoRefreshToken();
  }
}