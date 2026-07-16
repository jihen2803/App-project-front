import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h1 class="h2 mb-2">My Orders</h1>
          <p class="text-muted mb-0">Track and manage your purchases</p>
        </div>
        <div class="col-auto">
          <div class="badge bg-light text-dark rounded-pill px-3 py-2">
            <i class="bi bi-bag me-1"></i>
            {{ orders().length }} orders
          </div>
        </div>
      </div>

      <!-- Content -->
      @if (loading()) {
        <!-- Loading -->
        <div class="row">
          @for (i of [1,2,3]; track i) {
            <div class="col-12">
              <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                  <div class="skeleton-line mb-2"></div>
                  <div class="skeleton-line short mb-3"></div>
                  <div class="skeleton-line shorter"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (orders().length === 0) {
        <!-- Empty Orders -->
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-bag display-1 text-muted mb-4"></i>
            <h4 class="mb-3">No orders yet</h4>
            <p class="text-muted mb-4">Start shopping to see your orders here</p>
            <a routerLink="/products" class="btn btn-primary">
              <i class="bi bi-arrow-left me-2"></i>
              Browse Products
            </a>
          </div>
        </div>
      } @else {
        <!-- Orders List -->
        <div class="row">
          @for (order of orders(); track order.id) {
            <div class="col-12 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Order #{{ order.number }}</h6>
                    <div class="small text-muted">
                      <i class="bi bi-calendar me-1"></i>
                      {{ order.date }}
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="badge" [ngClass]="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </div>
                    <div class="mt-1">
                      <strong>{{ order.total.toFixed(2) }} USD</strong>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <!-- Order Items -->
                  <div class="row mb-3">
                    @for (item of order.items; track item.id) {
                      <div class="col-12 mb-2">
                        <div class="d-flex align-items-center">
                          <img [src]="item.image" 
                               [alt]="item.name"
                               class="order-item-image rounded me-3">
                          <div class="flex-grow-1">
                            <div class="d-flex justify-content-between">
                              <div>
                                <h6 class="mb-1">{{ item.name }}</h6>
                                <div class="small text-muted">
                                  Quantity: {{ item.quantity }}
                                  @if (item.size) {
                                    <span class="ms-2">Size: {{ item.size }}</span>
                                  }
                                  @if (item.color) {
                                    <span class="ms-2">Color: {{ item.color }}</span>
                                  }
                                </div>
                              </div>
                              <div class="text-end">
                                @if (item.discount && item.discount > 0) {
                                  <div class="text-danger fw-semibold">
                                    {{ (item.price * (1 - item.discount / 100) * item.quantity).toFixed(2) }} USD
                                  </div>
                                  <div class="text-muted text-decoration-line-through small">
                                    {{ (item.price * item.quantity).toFixed(2) }} USD
                                  </div>
                                } @else {
                                  <div class="fw-semibold">
                                    {{ (item.price * item.quantity).toFixed(2) }} USD
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Order Actions -->
                  <div class="row">
                    <div class="col-md-6">
                      <div class="small text-muted">
                        <i class="bi bi-truck me-1"></i>
                        {{ order.shippingAddress }}
                      </div>
                    </div>
                    <div class="col-md-6 text-md-end">
                      <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm me-2">
                          <i class="bi bi-eye me-1"></i>
                          View Details
                        </button>
                        @if (order.status === 'Delivered') {
                          <button class="btn btn-outline-success btn-sm me-2">
                            <i class="bi bi-check-circle me-1"></i>
                            Leave Review
                          </button>
                        }
                        <button class="btn btn-outline-secondary btn-sm">
                          <i class="bi bi-printer me-1"></i>
                          Print Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (orders().length > 0) {
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        }
      }
    </div>
  `,
  styles: [`
    .order-item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
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

    .badge-processing {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .badge-shipped {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .badge-delivered {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .badge-cancelled {
      background-color: #ffebee;
      color: #c62828;
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

    .page-link {
      border-color: #e0e0e0;
      color: var(--color-primary);
    }

    .page-link:hover {
      background-color: rgba(0, 0, 0, 0.02);
      border-color: #dee2e6;
    }

    .page-item.active .page-link {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .card {
      border-radius: 1rem;
    }
  `]
})
export class OrdersComponent {
  loading = signal(false);
  
  orders = signal([
    {
      id: 1,
      number: 'ORD-001',
      date: '2026-07-15',
      status: 'Delivered',
      total: 459.98,
      items: [
        {
          id: 1,
          name: 'Tailored Coat',
          image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
          quantity: 1,
          price: 240.00,
          discount: 0,
          size: 'M',
          color: 'Black'
        },
        {
          id: 2,
          name: 'Oversized Blazer',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c5b',
          quantity: 2,
          price: 185.00,
          discount: 15,
          size: 'L',
          color: 'Camel'
        }
      ],
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    {
      id: 2,
      number: 'ORD-002',
      date: '2026-07-10',
      status: 'Shipped',
      total: 310.00,
      items: [
        {
          id: 3,
          name: 'Leather Tote',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
          quantity: 1,
          price: 310.00,
          discount: 0,
          size: 'One Size',
          color: 'Black'
        }
      ],
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
    },
    {
      id: 3,
      number: 'ORD-003',
      date: '2026-07-05',
      status: 'Processing',
      total: 120.00,
      items: [
        {
          id: 4,
          name: 'Slim Trousers',
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
          quantity: 1,
          price: 120.00,
          discount: 0,
          size: '32',
          color: 'Navy'
        }
      ],
      shippingAddress: '789 Pine Blvd, Chicago, IL 60601'
    }
  ]);

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing': return 'badge-processing';
      case 'shipped': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge bg-light text-dark';
    }
  }

  ngOnInit(): void {
    // Simulate loading
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }
}
