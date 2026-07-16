import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { RegisterRequest } from '../../core/models/auth.models';

@Component({
  selector: 'app-register',
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
          <h2 class="h4 mb-2">Create Account</h2>
          <p class="text-muted mb-0">Join our fashion community</p>
        </div>

        <!-- Register Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <!-- First Name & Last Name -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" id="firstName" formControlName="firstName"
                     [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                     placeholder="John">
              @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                <div class="invalid-feedback">
                  First name is required
                </div>
              }
            </div>
            <div class="col-md-6">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="lastName" formControlName="lastName"
                     [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                     placeholder="Doe">
              @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                <div class="invalid-feedback">
                  Last name is required
                </div>
              }
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="email" formControlName="email"
                   [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                   placeholder="your@email.com">
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <div class="invalid-feedback">
                @if (registerForm.get('email')?.errors?.['required']) {
                  <div>Email is required</div>
                }
                @if (registerForm.get('email')?.errors?.['email']) {
                  <div>Please enter a valid email</div>
                }
              </div>
            }
          </div>

          <!-- Phone (Optional) -->
          <div class="mb-3">
            <label for="phone" class="form-label">Phone Number <span class="text-muted">(Optional)</span></label>
            <input type="tel" class="form-control" id="phone" formControlName="phone"
                   placeholder="+1 (123) 456-7890">
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" formControlName="password"
                   [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                   placeholder="Create a strong password">
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <div class="invalid-feedback">
                @if (registerForm.get('password')?.errors?.['required']) {
                  <div>Password is required</div>
                }
                @if (registerForm.get('password')?.errors?.['minlength']) {
                  <div>Password must be at least 8 characters</div>
                }
                @if (registerForm.get('password')?.errors?.['pattern']) {
                  <div>Password must include uppercase, lowercase, number and special character</div>
                }
              </div>
            }
            <div class="form-text small">
              Must be at least 8 characters with uppercase, lowercase, number and special character.
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword"
                   [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                   placeholder="Confirm your password">
            @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
              <div class="invalid-feedback">
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  <div>Please confirm your password</div>
                }
                @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  <div>Passwords do not match</div>
                }
              </div>
            }
          </div>

          <!-- Terms & Conditions -->
          <div class="mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="terms" formControlName="terms"
                     [class.is-invalid]="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched">
              <label class="form-check-label" for="terms">
                I agree to the 
                <a href="#" class="text-decoration-none">Terms of Service</a> and 
                <a href="#" class="text-decoration-none">Privacy Policy</a>
              </label>
              @if (registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched) {
                <div class="invalid-feedback d-block">
                  You must agree to the terms and conditions
                </div>
              }
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
              Creating Account...
            } @else {
              Create Account
            }
          </button>

          <!-- Login Link -->
          <div class="text-center">
            <p class="mb-0">Already have an account?
              <a routerLink="/auth/login" class="text-decoration-none fw-medium">
                Sign in here
              </a>
            </p>
          </div>
        </form>
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
      max-width: 500px;
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

    .alert-danger {
      border: none;
      background-color: rgba(229, 57, 53, 0.1);
      color: #d32f2f;
    }

    .form-check-input:checked {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  }, {
    validators: this.passwordMatchValidator
  });

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const request: RegisterRequest = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      phone: this.registerForm.value.phone || undefined
    };

    this.authApi.register(request).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
