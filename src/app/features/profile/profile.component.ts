import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <!-- Profile Header -->
              <div class="text-center mb-4">
                <div class="profile-avatar mb-3">
                  <div class="avatar-placeholder">
                    {{ userInitials() }}
                  </div>
                </div>
                <h5 class="mb-1">{{ userFullName() }}</h5>
                <p class="text-muted small mb-0">{{ session.currentUser()?.email }}</p>
                <div class="mt-2">
                  @for (role of session.currentUser()?.roles; track role) {
                    <span class="badge bg-light text-dark me-1">{{ role }}</span>
                  }
                </div>
              </div>

              <!-- Navigation -->
              <nav class="nav flex-column">
                <a routerLink="/profile" class="nav-link active">
                  <i class="bi bi-person me-2"></i>
                  Profile
                </a>
                <a routerLink="/orders" class="nav-link">
                  <i class="bi bi-bag me-2"></i>
                  Orders
                </a>
                <a routerLink="/wishlist" class="nav-link">
                  <i class="bi bi-heart me-2"></i>
                  Wishlist
                </a>
                <a href="#" class="nav-link">
                  <i class="bi bi-geo-alt me-2"></i>
                  Addresses
                </a>
                <a routerLink="/auth/login" class="nav-link text-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Logout
                </a>
              </nav>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">My Profile</h1>
            <div class="text-muted">Member since {{ memberSince() }}</div>
          </div>

          <!-- Personal Information Card -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" formControlName="firstName">
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" formControlName="lastName">
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" formControlName="email" [attr.disabled]="true">
                    <div class="form-text">Email cannot be changed</div>
                  </div>
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="phone" formControlName="phone">
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary" [disabled]="profileForm.pristine || saving()">
                    @if (saving()) {
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    } @else {
                      Save Changes
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Password Change Card -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="mb-0">Change Password</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="currentPassword" formControlName="currentPassword">
                  </div>
                  <div class="col-md-6">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="newPassword" formControlName="newPassword">
                    <div class="form-text small">
                      Must be at least 8 characters with uppercase, lowercase, number and special character.
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="confirmPassword" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword">
                  </div>
                </div>
                
                @if (passwordMessage()) {
                  <div class="alert" [class.alert-success]="passwordSuccess()" [class.alert-danger]="!passwordSuccess()" role="alert">
                    {{ passwordMessage() }}
                  </div>
                }

                <div class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid || changingPassword()">
                    @if (changingPassword()) {
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    } @else {
                      Update Password
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-avatar {
      display: flex;
      justify-content: center;
    }

    .avatar-placeholder {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-link {
      padding: 0.75rem 1rem;
      color: #6c757d;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      background-color: rgba(0, 0, 0, 0.02);
      color: var(--color-primary);
      border-left-color: var(--color-accent);
    }

    .nav-link.active {
      color: var(--color-primary);
      background-color: rgba(201, 162, 39, 0.05);
      border-left-color: var(--color-accent);
    }

    .card {
      border-radius: 1rem;
    }

    .form-control {
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
    }

    .form-control:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 0.2rem rgba(201, 162, 39, 0.25);
    }

    .btn-primary {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-dark-gray);
      border-color: var(--color-dark-gray);
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authApi = inject(AuthApiService);
  private fb = inject(FormBuilder);
  session = inject(SessionService);

  saving = signal(false);
  changingPassword = signal(false);
  passwordMessage = signal('');
  passwordSuccess = signal(false);

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(/^[+\d\s\-()]+$/)]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  userFullName = signal('');
  userInitials = signal('');
  memberSince = signal('2026');

  ngOnInit(): void {
    const user = this.session.currentUser();
    if (user) {
      this.userFullName.set(`${user.firstName} ${user.lastName}`);
      this.userInitials.set(
        (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')
      );
      
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: ''
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    // Simulate API call
    setTimeout(() => {
      this.saving.set(false);
      this.profileForm.markAsPristine();
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.changingPassword.set(true);
    this.passwordMessage.set('');
    
    // Simulate API call
    setTimeout(() => {
      this.changingPassword.set(false);
      this.passwordSuccess.set(true);
      this.passwordMessage.set('Password updated successfully');
      this.passwordForm.reset();
    }, 1500);
  }

  logout(): void {
    this.authApi.logout().subscribe({
      next: () => window.location.href = '/auth/login',
      error: () => window.location.href = '/auth/login',
    });
  }
}
