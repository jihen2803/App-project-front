import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistApiService } from '../../core/services/wishlist-api.service';
import { SessionService } from '../../core/services/session.service';
import { CartApiService } from '../../core/services/cart-api.service';
import { WishlistResponse } from '../../core/models/wishlist.models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2">My Wishlist</h1>
          <p class="text-muted mb-0">Save items you love and move them to your cart later</p>
        </div>
        <div class="col-auto">
          <div class="badge bg-light text-dark rounded-pill px-3 py-2">
            <i class="bi bi-heart me-1"></i>
            {{ wishlistItems().length }} items
          </div>
        </div>
      </div>

      <!-- Content -->
      @if (!session.isAuthenticated()) {
        <!-- Not Authenticated -->
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-heart display-1 text-muted mb-4"></i>
            <h4 class="mb-3">Sign in to save items</h4>
            <p class="text-muted mb-4">Login to your account to add items to your wishlist</p>
            <div class="d-flex justify-content-center gap-3">
              <a routerLink="/auth/login" class="btn btn-primary">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </a>
              <a routerLink="/products" class="btn btn-outline-primary">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      } @else if (loading()) {
        <!-- Loading -->
        <div class="row g-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="col-md-6 col-lg-4 col-xl-3">
              <div class="card border-0 shadow-sm">
                <div class="skeleton-image card-img-top"></div>
                <div class="card-body">
                  <div class="skeleton-line mb-2"></div>
                  <div class="skeleton-line short mb-3"></div>
                  <div class="skeleton-line shorter"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (wishlistItems().length === 0) {
        <!-- Empty Wishlist -->
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-heart display-1 text-muted mb-4"></i>
            <h4 class="mb-3">Your wishlist is empty</h4>
            <p class="text-muted mb-4">Save items you love by clicking the heart icon</p>
            <a routerLink="/products" class="btn btn-primary">
              <i class="bi bi-arrow-left me-2"></i>
              Browse Products
            </a>
          </div>
        </div>
      } @else {
        <!-- Wishlist Items -->
        <div class="row g-4">
          @for (item of wishlistItems(); track item.product.id) {
            <div class="col-md-6 col-lg-4 col-xl-3">
              <div class="card product-card border-0 shadow-sm h-100">
                <!-- Product Image -->
                <div class="position-relative">
                  <a [routerLink]="['/products', item.product.slug]" class="text-decoration-none">
                    <img [src]="item.product.images[0]" 
                         [alt]="item.product.name"
                         class="card-img-top product-image"
                         loading="lazy">
                  </a>
                  
                  <!-- Remove from Wishlist -->
                  <button class="btn btn-link position-absolute top-0 end-0 p-2"
                          (click)="removeFromWishlist(item.product.id)"
                          [title]="'Remove from wishlist'">
                    <i class="bi bi-heart-fill text-danger fs-5"></i>
                  </button>

                  <!-- Discount Badge -->
                  @if (item.product.discount && item.product.discount > 0) {
                    <div class="position-absolute top-0 start-0 m-2">
                      <span class="badge bg-danger rounded-pill px-2 py-1">
                        -{{ item.product.discount }}%
                      </span>
                    </div>
                  }
                </div>

                <!-- Card Body -->
                <div class="card-body d-flex flex-column">
                  <!-- Category -->
                  <div class="small text-muted mb-1">
                    {{ item.product.category?.name || 'Fashion' }}
                  </div>

                  <!-- Product Name -->
                  <h6 class="card-title mb-2">
                    <a [routerLink]="['/products', item.product.slug]" 
                       class="text-decoration-none text-dark">
                      {{ item.product.name }}
                    </a>
                  </h6>

                  <!-- Brand -->
                  <div class="small text-muted mb-2">
                    {{ item.product.brand?.name || 'ATELIER NOIR' }}
                  </div>

                  <!-- Price -->
                  <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      @if (item.product.discount && item.product.discount > 0) {
                        <div>
                          <span class="text-danger fw-semibold me-2">
                            {{ calculateDiscountedPrice(item.product.price, item.product.discount!).toFixed(2) }} USD
                          </span>
                          <span class="text-muted text-decoration-line-through small">
                            {{ item.product.price.toFixed(2) }} USD
                          </span>
                        </div>
                      } @else {
                        <div class="fw-semibold">{{ item.product.price.toFixed(2) }} USD</div>
                      }
                    </div>

                    <!-- Actions -->
                    <div class="d-grid gap-2">
                      <button class="btn btn-outline-primary btn-sm" 
                              (click)="moveToCart(item.product.id)">
                        <i class="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                      <a [routerLink]="['/products', item.product.slug]" 
                         class="btn btn-outline-secondary btn-sm">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Stock Status -->
                @if (item.product.stock <= 0) {
                  <div class="card-footer bg-light border-0">
                    <div class="text-danger small">
                      <i class="bi bi-exclamation-triangle me-1"></i>
                      Out of Stock
                    </div>
                  </div>
                } @else if (item.product.stock <= 5) {
                  <div class="card-footer bg-light border-0">
                    <div class="text-warning small">
                      <i class="bi bi-exclamation-circle me-1"></i>
                      Only {{ item.product.stock }} left
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Actions -->
        @if (wishlistItems().length > 0) {
          <div class="mt-5 pt-4 border-top">
            <div class="row align-items-center">
              <div class="col">
                <button class="btn btn-outline-danger" (click)="clearWishlist()">
                  <i class="bi bi-trash me-2"></i>
                  Clear Wishlist
                </button>
              </div>
              <div class="col-auto">
                <a routerLink="/products" class="btn btn-outline-primary me-2">
                  <i class="bi bi-arrow-left me-2"></i>
                  Continue Shopping
                </a>
                <a routerLink="/cart" class="btn btn-primary">
                  View Cart
                  <i class="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .product-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
    }

    .product-image {
      height: 200px;
      object-fit: cover;
      border-radius: 0.375rem 0.375rem 0 0;
    }

    .skeleton-image {
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 0.375rem 0.375rem 0 0;
    }

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .skeleton-line.short {
      width: 60%;
    }

    .skeleton-line.shorter {
      width: 40%;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .btn-outline-primary {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .btn-outline-primary:hover {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: white;
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
export class WishlistComponent implements OnInit {
  private wishlistApi = inject(WishlistApiService);
  private cartApi = inject(CartApiService);
  session = inject(SessionService);

  wishlist = signal<WishlistResponse | null>(null);
  wishlistItems = computed(() => this.wishlist()?.items || []);
  loading = signal(true);

  ngOnInit(): void {
    if (this.session.isAuthenticated()) {
      this.loadWishlist();
    } else {
      this.loading.set(false);
    }
  }

  loadWishlist(): void {
    this.loading.set(true);
    this.wishlistApi.getWishlist().subscribe({
      next: (wishlist) => {
        this.wishlist.set(wishlist);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load wishlist:', error);
        this.loading.set(false);
      }
    });
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    return price * (1 - discount / 100);
  }

  removeFromWishlist(productId: number): void {
    this.wishlistApi.removeFromWishlist(productId).subscribe({
      next: () => this.loadWishlist(),
      error: (error) => console.error('Failed to remove from wishlist:', error)
    });
  }

  moveToCart(productId: number): void {
    this.cartApi.addToCart({
      productId: productId,
      quantity: 1
    }).subscribe({
      next: () => {
        this.removeFromWishlist(productId);
      },
      error: (error) => console.error('Failed to move to cart:', error)
    });
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist? This action cannot be undone.')) {
      this.wishlistApi.clearWishlist().subscribe({
        next: () => this.loadWishlist(),
        error: (error) => console.error('Failed to clear wishlist:', error)
      });
    }
  }
}
