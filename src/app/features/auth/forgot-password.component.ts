import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <!-- Logo -->
        <div class="text-center mb-4">
          <a routerLink="/" class="navbar-brand fw-bold fs-3 text-dark d-inline-block mb-3">
            <span class="text-accent">ATELIER</span><span class="text-dark">NOIR</span>
          </a>
          <h2 class="h4 mb-2">Forgot Password?</h2>
          <p class="text-muted mb-0">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <!-- Forgot Password Form -->
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="email" formControlName="email"
                   [class.is-invalid]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
                   placeholder="your@email.com">
            @if (forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched) {
              <div class="invalid-feedback">
                @if (forgotPasswordForm.get('email')?.errors?.['required']) {
                  <div>Email is required</div>
                }
                @if (forgotPasswordForm.get('email')?.errors?.['email']) {
                  <div>Please enter a valid email</div>
                }
              </div>
            }
          </div>

          <!-- Success Message -->
          @if (successMessage()) {
            <div class="alert alert-success alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ successMessage() }}
              <button type="button" class="btn-close" (click)="successMessage.set('')"></button>
            </div>
          }

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ errorMessage() }}
              <button type="button" class="btn-close" (click)="errorMessage.set('')"></button>
            </div>
          }

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 mb-3" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Sending...
            } @else {
              Send Reset Instructions
            }
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <a routerLink="/auth/login" class="text-decoration-none fw-medium">
              <i class="bi bi-arrow-left me-1"></i>
              Back to Login
            </a>
          </div>
        </form>
      </div>

      <!-- Note -->
      <div class="auth-card mt-3">
        <div class="alert alert-info mb-0">
          <i class="bi bi-info-circle-fill me-2"></i>
          <span class="small">
            For security reasons, the reset link will expire in 1 hour. 
            Check your spam folder if you don't see the email.
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .form-control {
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 0.2rem rgba(201, 162, 39, 0.25);
    }

    .btn-primary {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-dark-gray);
      border-color: var(--color-dark-gray);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .text-accent {
      color: var(--color-accent);
    }

    .alert-success {
      border: none;
      background-color: rgba(76, 175, 80, 0.1);
      color: #388e3c;
      border-left: 4px solid #4caf50;
    }

    .alert-danger {
      border: none;
      background-color: rgba(229, 57, 53, 0.1);
      color: #d32f2f;
      border-left: 4px solid #e53935;
    }

    .alert-info {
      border: none;
      background-color: rgba(201, 162, 39, 0.1);
      color: #8a6d3b;
      border-left: 4px solid var(--color-accent);
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.authApi.forgotPassword({
      email: this.forgotPasswordForm.value.email!
    }).subscribe({
      next: () => {
        this.successMessage.set('Password reset instructions have been sent to your email. Please check your inbox.');
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        // Don't reveal if email exists for security
        this.successMessage.set('If your email exists in our system, you will receive reset instructions shortly.');
        this.errorMessage.set('');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
