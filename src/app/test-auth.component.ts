import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthApiService } from './core/services/auth-api.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-test-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h2>Authentication Test</h2>
      
      <div class="card mb-3">
        <div class="card-body">
          <h5>Test Login</h5>
          <button class="btn btn-primary me-2" (click)="testLogin()">Test Admin Login</button>
          <button class="btn btn-secondary" (click)="testLogout()">Test Logout</button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5>Current Session Status</h5>
          <pre>{{ sessionStatus() }}</pre>
          <div>
            <strong>Is Authenticated:</strong> {{ session.isAuthenticated() }}
          </div>
          <div *ngIf="session.currentUser()">
            <strong>User:</strong> {{ session.currentUser()?.firstName }} {{ session.currentUser()?.lastName }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestAuthComponent {
  private authApi = inject(AuthApiService);
  session = inject(SessionService);

  sessionStatus(): string {
    return JSON.stringify(this.session.currentUser(), null, 2);
  }

  testLogin(): void {
    console.log('Testing login...');
    this.authApi.login({
      email: 'admin@ateliernoir.com',
      password: 'Admin123!'
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert('Login successful! Token received.');
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed: ' + error.message);
      }
    });
  }

  testLogout(): void {
    console.log('Testing logout...');
    this.authApi.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        alert('Logout successful!');
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('Logout failed: ' + error.message);
      }
    });
  }
}