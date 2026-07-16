import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12 mb-4">
          <div class="progress-steps">
            <div class="step active">
              <div class="step-number">1</div>
              <div class="step-label">Shipping</div>
            </div>
            <div class="step-line active"></div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-label">Payment</div>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-label">Review</div>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-label">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h4 class="card-title mb-4">Shipping Address</h4>
              
              <form [formGroup]="shippingForm" (ngSubmit)="placeOrder()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input type="text" class="form-control" id="firstName" formControlName="firstName">
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input type="text" class="form-control" id="lastName" formControlName="lastName">
                  </div>
                  <div class="col-12">
                    <label for="address" class="form-label">Street Address *</label>
                    <input type="text" class="form-control" id="address" formControlName="address">
                  </div>
                  <div class="col-md-6">
                    <label for="city" class="form-label">City *</label>
                    <input type="text" class="form-control" id="city" formControlName="city">
                  </div>
                  <div class="col-md-6">
                    <label for="postalCode" class="form-label">Postal Code *</label>
                    <input type="text" class="form-control" id="postalCode" formControlName="postalCode">
                  </div>
                  <div class="col-md-6">
                    <label for="country" class="form-label">Country *</label>
                    <input type="text" class="form-control" id="country" formControlName="country">
                  </div>
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Phone Number *</label>
                    <input type="tel" class="form-control" id="phone" formControlName="phone">
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="saveAddress" formControlName="saveAddress">
                      <label class="form-check-label" for="saveAddress">
                        Save this address for future orders
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-top">
                  <h5 class="mb-3">Payment Method</h5>
                  <div class="row g-3">
                    <div class="col-12">
                      <div class="payment-methods">
                        <div class="payment-method active">
                          <input type="radio" id="card" name="paymentMethod" value="card" checked>
                          <label for="card">
                            <i class="bi bi-credit-card me-2"></i>
                            Credit/Debit Card
                          </label>
                        </div>
                        <div class="payment-method">
                          <input type="radio" id="paypal" name="paymentMethod" value="paypal">
                          <label for="paypal">
                            <i class="bi bi-paypal me-2"></i>
                            PayPal
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-check mt-4">
                  <input class="form-check-input" type="checkbox" id="terms" [(ngModel)]="acceptedTerms" 
                         [ngModelOptions]="{standalone: true}">
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and 
                    <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                @if (errorMessage()) {
                  <div class="alert alert-danger mt-3">
                    {{ errorMessage() }}
                  </div>
                }

                <div class="d-flex justify-content-between mt-4">
                  <a routerLink="/cart" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-left me-2"></i>
                    Back to Cart
                  </a>
                  <button type="submit" class="btn btn-primary" [disabled]="loading() || !acceptedTerms()">
                    @if (loading()) {
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    } @else {
                      <i class="bi bi-check-circle me-2"></i>
                      Place Order
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 1rem;">
            <div class="card-body">
              <h5 class="card-title mb-4">Order Summary</h5>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>$459.98 USD</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>$0.00 USD</span>
                </div>
                <div class="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>-$55.50 USD</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>$36.80 USD</span>
                </div>
              </div>

              <hr class="my-4">

              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold">Total</span>
                <span class="fw-bold h5">$441.28 USD</span>
              </div>

              <div class="order-items">
                <div class="order-item d-flex align-items-center mb-3">
                  <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b" 
                       alt="Tailored Coat"
                       class="order-item-image rounded me-3">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">Tailored Coat</h6>
                    <div class="small text-muted">Size: M, Color: Black</div>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold">$240.00 USD</div>
                  </div>
                </div>
                <div class="order-item d-flex align-items-center">
                  <img src="https://images.unsplash.com/photo-1594938298603-c8148c4b4c5b" 
                       alt="Oversized Blazer"
                       class="order-item-image rounded me-3">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">Oversized Blazer</h6>
                    <div class="small text-muted">Size: L, Color: Camel (x2)</div>
                  </div>
                  <div class="text-end">
                    <div class="text-danger fw-semibold">$314.50 USD</div>
                    <div class="text-muted text-decoration-line-through small">$370.00 USD</div>
                  </div>
                </div>
              </div>

              <div class="alert alert-light small mt-4 mb-0">
                <i class="bi bi-shield-check me-2 text-success"></i>
                256-bit SSL secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.5;
    }

    .step.active {
      opacity: 1;
    }

    .step-number {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e9ecef;
      border-radius: 50%;
      font-weight: 600;
      color: #6c757d;
    }

    .step.active .step-number {
      background: var(--color-accent);
      color: white;
    }

    .step-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6c757d;
    }

    .step.active .step-label {
      color: var(--color-dark-gray);
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: #e9ecef;
      max-width: 80px;
    }

    .step-line.active {
      background: var(--color-accent);
    }

    .payment-methods {
      display: grid;
      gap: 0.5rem;
    }

    .payment-method {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .payment-method:hover {
      border-color: #dee2e6;
    }

    .payment-method.active {
      border-color: var(--color-accent);
      background-color: rgba(201, 162, 39, 0.05);
    }

    .payment-method input {
      display: none;
    }

    .payment-method label {
      display: flex;
      align-items: center;
      margin: 0;
      cursor: pointer;
      font-weight: 500;
    }

    .order-item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
    }

    .card {
      border-radius: 1rem;
    }

    .form-control {
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
    }

    .btn-primary {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
  `]
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  session = inject(SessionService);

  loading = signal(false);
  acceptedTerms = signal(false);
  errorMessage = signal('');

  shippingForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required],
    saveAddress: [true]
  });

  ngOnInit(): void {
    // Pre-fill shipping info from user profile
    const user = this.session.currentUser();
    if (user) {
      this.shippingForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }

  placeOrder(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    if (!this.acceptedTerms()) {
      this.errorMessage.set('Please accept the terms and conditions');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    // Simulate order placement
    setTimeout(() => {
      this.loading.set(false);
      alert('Order placed successfully! Thank you for your purchase.');
      this.router.navigate(['/orders']);
    }, 2000);
  }
}
