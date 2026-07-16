import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-reset-password',
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
          <h2 class="h4 mb-2">Reset Your Password</h2>
          <p class="text-muted mb-0">
            Create a new password for your account
          </p>
        </div>

        <!-- Reset Password Form -->
        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
          <!-- New Password -->
          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input type="password" class="form-control" id="newPassword" formControlName="newPassword"
                   [class.is-invalid]="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched"
                   placeholder="Create a strong password">
            @if (resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched) {
              <div class="invalid-feedback">
                @if (resetPasswordForm.get('newPassword')?.errors?.['required']) {
                  <div>Password is required</div>
                }
                @if (resetPasswordForm.get('newPassword')?.errors?.['minlength']) {
                  <div>Password must be at least 8 characters</div>
                }
                @if (resetPasswordForm.get('newPassword')?.errors?.['pattern']) {
                  <div>Password must include uppercase, lowercase, number and special character</div>
                }
              </div>
            }
            <div class="form-text small">
              Must be at least 8 characters with uppercase, lowercase, number and special character.
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="mb-4">
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword"
                   [class.is-invalid]="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched"
                   placeholder="Confirm your new password">
            @if (resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched) {
              <div class="invalid-feedback">
                @if (resetPasswordForm.get('confirmPassword')?.errors?.['required']) {
                  <div>Please confirm your password</div>
                }
                @if (resetPasswordForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  <div>Passwords do not match</div>
                }
              </div>
            }
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ errorMessage() }}
              <button type="button" class="btn-close" (click)="errorMessage.set('')"></button>
            </div>
          }

          <!-- Success Message -->
          @if (successMessage()) {
            <div class="alert alert-success alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ successMessage() }}
              <button type="button" class="btn-close" (click)="successMessage.set('')"></button>
            </div>
          }

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 mb-3" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Resetting...
            } @else {
              Reset Password
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

      <!-- Token Note -->
      <div class="auth-card mt-3" *ngIf="token">
        <div class="alert alert-info mb-0">
          <i class="bi bi-info-circle-fill me-2"></i>
          <span class="small">
            Using reset token. This token will expire after use.
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
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  token = '';

  resetPasswordForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.errorMessage.set('Invalid or missing reset token. Please request a new password reset.');
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.authApi.resetPassword({
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword!
    }).subscribe({
      next: () => {
        this.successMessage.set('Password reset successful! You can now login with your new password.');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Password reset failed. The token may be invalid or expired.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
