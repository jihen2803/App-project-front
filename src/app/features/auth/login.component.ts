import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { LoginRequest } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
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
          <h2 class="h4 mb-2">Welcome Back</h2>
          <p class="text-muted mb-0">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="email" formControlName="email"
                   [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                   placeholder="your@email.com">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="invalid-feedback">
                @if (loginForm.get('email')?.errors?.['required']) {
                  <div>Email is required</div>
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  <div>Please enter a valid email</div>
                }
              </div>
            }
          </div>

          <!-- Password -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <label for="password" class="form-label">Password</label>
              <a routerLink="/auth/forgot-password" class="text-decoration-none small">
                Forgot password?
              </a>
            </div>
            <input type="password" class="form-control" id="password" formControlName="password"
                   [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                   placeholder="Enter your password">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="invalid-feedback">
                Password is required
              </div>
            }
          </div>

          <!-- Remember Me -->
          <div class="mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" formControlName="rememberMe">
              <label class="form-check-label" for="rememberMe">
                Remember me
              </label>
            </div>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              {{ errorMessage() }}
              <button type="button" class="btn-close" (click)="errorMessage.set('')"></button>
            </div>
          }

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 mb-3" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Signing in...
            } @else {
              Sign In
            }
          </button>

          <!-- Divider -->
          <div class="position-relative text-center my-4">
            <hr class="my-0">
            <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
              OR
            </span>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <p class="mb-0">Don't have an account?
              <a routerLink="/auth/register" class="text-decoration-none fw-medium">
                Sign up now
              </a>
            </p>
          </div>
        </form>
      </div>

      <!-- Demo Credentials -->
      <div class="auth-card mt-3">
        <div class="alert alert-info mb-0">
          <h6 class="alert-heading mb-2">Demo Credentials:</h6>
          <div class="small">
            <p class="mb-1"><strong>Admin:</strong> admin&#64;ateliernoir.com / Admin123!</p>
            <p class="mb-0"><strong>Customer:</strong> customer&#64;ateliernoir.com / Customer123!</p>
          </div>
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

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .text-accent {
      color: var(--color-accent);
    }

    .alert-danger {
      border: none;
      background-color: rgba(229, 57, 53, 0.1);
      color: #d32f2f;
    }

    .alert-info {
      border: none;
      background-color: rgba(201, 162, 39, 0.1);
      border-left: 4px solid var(--color-accent);
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authApi.login(request).subscribe({
      next: () => {
        // Save remember me preference
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberEmail', request.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        
        // Redirect based on user role
        const hasAdminRole = this.authApi['session'].currentUser()?.roles.includes('ROLE_ADMIN') ?? false;
        this.router.navigate(hasAdminRole ? ['/admin'] : ['/']);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Invalid email or password. Please try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    // Pre-fill email if remembered
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({ email: rememberedEmail, rememberMe: true });
    }
  }
}
