import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartApiService } from '../../core/services/cart-api.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">Shopping Cart</h1>
            <div class="text-muted">{{ cartItems().length }} items</div>
          </div>

          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
              @if (loading()) {
                <div class="p-4 text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              } @else if (cartItems().length === 0) {
                <div class="text-center py-5">
                  <i class="bi bi-cart-x display-1 text-muted mb-4"></i>
                  <h5 class="mb-3">Your cart is empty</h5>
                  <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
                  <a routerLink="/products" class="btn btn-primary">
                    <i class="bi bi-arrow-left me-2"></i>
                    Start Shopping
                  </a>
                </div>
              } @else {
                <div class="cart-items">
                  @for (item of cartItems(); track item.product.id) {
                    <div class="cart-item p-4 border-bottom">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <img [src]="item.product.images[0]" 
                               [alt]="item.product.name"
                               class="cart-item-image rounded"
                               loading="lazy">
                        </div>
                        <div class="col">
                          <div class="row align-items-center">
                            <div class="col-md-5">
                              <h6 class="mb-1">{{ item.product.name }}</h6>
                              <div class="small text-muted">
                                @if (item.selectedSize) {
                                  <span class="me-2">Size: {{ item.selectedSize }}</span>
                                }
                                @if (item.selectedColor) {
                                  <span>Color: {{ item.selectedColor }}</span>
                                }
                              </div>
                              <div class="mt-2">
                                @if (item.product.discount && item.product.discount > 0) {
                                  <span class="text-danger fw-semibold me-2">
                                    {{ (item.product.price * (1 - item.product.discount / 100)).toFixed(2) }} USD
                                  </span>
                                  <span class="text-muted text-decoration-line-through small">
                                    {{ item.product.price.toFixed(2) }} USD
                                  </span>
                                } @else {
                                  <span class="fw-semibold">{{ item.product.price.toFixed(2) }} USD</span>
                                }
                              </div>
                            </div>
                            <div class="col-md-3">
                              <div class="d-flex align-items-center">
                                <button class="btn btn-outline-secondary btn-sm" 
                                        (click)="updateQuantity(item, item.quantity - 1)"
                                        [disabled]="item.quantity <= 1">
                                  <i class="bi bi-dash"></i>
                                </button>
                                <input type="number" 
                                       class="form-control form-control-sm mx-2 text-center"
                                       [value]="item.quantity"
                                       min="1"
                                       max="10"
                                       (change)="onQuantityChange(item, $event)"
                                       style="width: 60px;">
                                <button class="btn btn-outline-secondary btn-sm" 
                                        (click)="updateQuantity(item, item.quantity + 1)"
                                        [disabled]="item.quantity >= 10">
                                  <i class="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                            <div class="col-md-2 text-md-end">
                              <div class="fw-semibold">
                                {{ calculateItemSubtotal(item).toFixed(2) }} USD
                              </div>
                            </div>
                            <div class="col-md-2 text-md-end">
                              <button class="btn btn-link text-danger p-0" 
                                      (click)="removeItem(item)">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div class="p-4 border-top">
                  <div class="row align-items-center">
                    <div class="col">
                      <button class="btn btn-outline-secondary" (click)="clearCart()">
                        <i class="bi bi-trash me-2"></i>
                        Clear Cart
                      </button>
                    </div>
                    <div class="col-auto">
                      <a routerLink="/products" class="btn btn-outline-primary me-2">
                        <i class="bi bi-arrow-left me-2"></i>
                        Continue Shopping
                      </a>
                      @if (cartItems().length > 0) {
                        <a routerLink="/checkout" class="btn btn-primary">
                          Proceed to Checkout
                          <i class="bi bi-arrow-right ms-2"></i>
                        </a>
                      } @else {
                        <button class="btn btn-primary" disabled>
                          Proceed to Checkout
                          <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          @if (cartItems().length > 0) {
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body">
                <h6 class="mb-3">Apply Coupon Code</h6>
                <div class="row g-2">
                  <div class="col">
                    <input type="text" 
                           class="form-control" 
                           placeholder="Enter coupon code"
                           [(ngModel)]="couponCode"
                           [disabled]="couponLoading()">
                  </div>
                  <div class="col-auto">
                    <button class="btn btn-outline-primary" 
                            (click)="applyCoupon()"
                            [disabled]="!couponCode || couponLoading()">
                      @if (couponLoading()) {
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      } @else {
                        <i class="bi bi-tag me-2"></i>
                      }
                      Apply
                    </button>
                  </div>
                </div>
                @if (couponMessage()) {
                  <div class="mt-2 small" [class.text-success]="couponSuccess()" [class.text-danger]="!couponSuccess()">
                    {{ couponMessage() }}
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 1rem;">
            <div class="card-body">
              <h5 class="card-title mb-4">Order Summary</h5>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{{ calculateSubtotal().toFixed(2) }} USD</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>{{ calculateShipping().toFixed(2) }} USD</span>
                </div>
                @if (couponDiscount() && couponDiscount() > 0) {
                  <div class="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-{{ couponDiscount().toFixed(2) }} USD</span>
                  </div>
                }
                @if (cartTax() && cartTax() > 0) {
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tax</span>
                    <span>{{ cartTax().toFixed(2) }} USD</span>
                  </div>
                }
              </div>

              <hr class="my-4">

              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold">Total</span>
                <span class="fw-bold h5">{{ calculateTotal().toFixed(2) }} USD</span>
              </div>

              @if (cartItems().length > 0) {
                <a routerLink="/checkout" 
                   class="btn btn-primary w-100 py-3 mb-3">
                  <i class="bi bi-lock me-2"></i>
                  Secure Checkout
                </a>
              } @else {
                <button class="btn btn-primary w-100 py-3 mb-3" disabled>
                  <i class="bi bi-lock me-2"></i>
                  Secure Checkout
                </button>
              }

              <div class="text-center mb-3">
                <div class="small text-muted mb-2">We accept</div>
                <div class="d-flex justify-content-center gap-2">
                  <i class="bi bi-credit-card text-muted"></i>
                  <i class="bi bi-paypal text-muted"></i>
                  <i class="bi bi-google text-muted"></i>
                  <i class="bi bi-apple text-muted"></i>
                </div>
              </div>

              <div class="alert alert-light small mb-0">
                <i class="bi bi-shield-check me-2 text-success"></i>
                Your payment information is encrypted and secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
    }

    .cart-item:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class CartComponent implements OnInit {
  private cartApi = inject(CartApiService);
  private session = inject(SessionService);

  cartItems = signal<any[]>([]);
  loading = signal(true);
  couponCode = '';
  couponLoading = signal(false);
  couponMessage = signal('');
  couponSuccess = signal(false);

  // Mock data for demo
  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
      // Mock cart items
      this.cartItems.set([
        {
          id: 1,
          product: {
            id: 1,
            name: 'Tailored Coat',
            price: 240.00,
            discount: 0,
            images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b'],
            stock: 12
          },
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Black'
        },
        {
          id: 2,
          product: {
            id: 2,
            name: 'Oversized Blazer',
            price: 185.00,
            discount: 15,
            images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4c5b'],
            stock: 8
          },
          quantity: 2,
          selectedSize: 'L',
          selectedColor: 'Camel'
        }
      ]);
    }, 1000);
  }

  // Computed values
  calculateSubtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + this.calculateItemSubtotal(item), 0);
  });

  calculateShipping = computed(() => {
    const subtotal = this.calculateSubtotal();
    return subtotal > 120 ? 0 : 9.99;
  });

  calculateTotal = computed(() => {
    const subtotal = this.calculateSubtotal();
    const shipping = this.calculateShipping();
    return subtotal + shipping;
  });

  couponDiscount = computed(() => 0);
  cartTax = computed(() => 0);

  calculateItemSubtotal(item: any): number {
    const basePrice = item.product.discount && item.product.discount > 0 
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    
    return basePrice * item.quantity;
  }

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1 || newQuantity > 10) return;
    item.quantity = newQuantity;
  }

  onQuantityChange(item: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);
    
    if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 10) {
      input.value = item.quantity.toString();
      return;
    }

    this.updateQuantity(item, newQuantity);
  }

  removeItem(item: any): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartItems.set(this.cartItems().filter(i => i.id !== item.id));
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      this.cartItems.set([]);
    }
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;

    this.couponLoading.set(true);
    this.couponMessage.set('');
    
    // Simulate API call
    setTimeout(() => {
      if (this.couponCode.toLowerCase() === 'welcome10') {
        this.couponSuccess.set(true);
        this.couponMessage.set('Coupon applied successfully! 10% discount applied.');
      } else {
        this.couponSuccess.set(false);
        this.couponMessage.set('Invalid coupon code');
      }
      this.couponLoading.set(false);
    }, 1000);
  }
}
