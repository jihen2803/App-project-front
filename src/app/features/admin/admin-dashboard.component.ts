import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="sidebar-header">
          <h5 class="mb-0">
            <i class="bi bi-speedometer2 me-2"></i>
            Admin Panel
          </h5>
        </div>
        
        <ul class="nav flex-column">
          <li class="nav-item">
            <a routerLink="/admin" class="nav-link active">
              <i class="bi bi-house me-2"></i>
              Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-bag me-2"></i>
              Products
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-tags me-2"></i>
              Categories
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-shop me-2"></i>
              Brands
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-cart me-2"></i>
              Orders
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-people me-2"></i>
              Customers
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-tag me-2"></i>
              Coupons
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-bar-chart me-2"></i>
              Analytics
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <a routerLink="/" class="btn btn-outline-light btn-sm w-100">
            <i class="bi bi-arrow-left me-1"></i>
            Back to Store
          </a>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="admin-content">
        <!-- Top Bar -->
        <div class="admin-topbar">
          <div class="d-flex justify-content-between align-items-center">
            <h1 class="h4 mb-0">Dashboard Overview</h1>
            <div class="dropdown">
              <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-calendar me-1"></i>
                Last 30 days
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Today</a></li>
                <li><a class="dropdown-item" href="#">Last 7 days</a></li>
                <li><a class="dropdown-item active" href="#">Last 30 days</a></li>
                <li><a class="dropdown-item" href="#">Last 90 days</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="text-muted mb-2">Revenue</h6>
                    <h3 class="mb-0">$24,580</h3>
                    <span class="text-success small">
                      <i class="bi bi-arrow-up me-1"></i>
                      12.5%
                    </span>
                  </div>
                  <div class="stat-icon bg-success">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="text-muted mb-2">Orders</h6>
                    <h3 class="mb-0">1,248</h3>
                    <span class="text-success small">
                      <i class="bi bi-arrow-up me-1"></i>
                      8.3%
                    </span>
                  </div>
                  <div class="stat-icon bg-primary">
                    <i class="bi bi-bag"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="text-muted mb-2">Customers</h6>
                    <h3 class="mb-0">854</h3>
                    <span class="text-success small">
                      <i class="bi bi-arrow-up me-1"></i>
                      5.2%
                    </span>
                  </div>
                  <div class="stat-icon bg-warning">
                    <i class="bi bi-people"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="text-muted mb-2">Products</h6>
                    <h3 class="mb-0">156</h3>
                    <span class="text-danger small">
                      <i class="bi bi-arrow-down me-1"></i>
                      2.1%
                    </span>
                  </div>
                  <div class="stat-icon bg-info">
                    <i class="bi bi-box"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="row g-4 mb-4">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Revenue Overview</h6>
              </div>
              <div class="card-body">
                <div class="chart-placeholder">
                  <div class="text-center py-5">
                    <i class="bi bi-bar-chart display-3 text-muted mb-3"></i>
                    <p class="text-muted">Revenue chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">Top Products</h6>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  @for (product of topProducts(); track product.id) {
                    <div class="list-group-item border-0 px-0 py-3">
                      <div class="d-flex align-items-center">
                        <img [src]="product.image" 
                             [alt]="product.name"
                             class="rounded me-3"
                             style="width: 40px; height: 40px; object-fit: cover;">
                        <div class="flex-grow-1">
                          <h6 class="mb-1">{{ product.name }}</h6>
                          <div class="small text-muted">{{ product.sales }} sales</div>
                        </div>
                        <div class="text-end">
                          <strong>\${{ product.revenue.toFixed(2) }}</strong>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Recent Orders</h6>
            <a href="#" class="btn btn-sm btn-outline-primary">View All</a>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of recentOrders(); track order.id) {
                    <tr>
                      <td>
                        <a href="#" class="text-decoration-none fw-medium">
                          #{{ order.id }}
                        </a>
                      </td>
                      <td>{{ order.customer }}</td>
                      <td>{{ order.date }}</td>
                      <td>\${{ order.amount.toFixed(2) }}</td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(order.status)">
                          {{ order.status }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-secondary">
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      display: flex;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .admin-sidebar {
      width: 240px;
      background: var(--color-primary);
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav {
      padding: 1rem 0;
      flex-grow: 1;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      padding: 0.75rem 1.5rem;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-left-color: var(--color-accent);
    }

    .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border-left-color: var(--color-accent);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .admin-topbar {
      margin-bottom: 2rem;
    }

    .stat-card {
      border: none;
      border-radius: 0.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
    }

    .chart-placeholder {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 0.5rem;
    }

    .table {
      margin-bottom: 0;
    }

    .table th {
      font-weight: 600;
      border-top: none;
      color: #6c757d;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table td {
      vertical-align: middle;
      padding: 1rem;
    }

    .badge {
      padding: 0.35rem 0.65rem;
      font-weight: 500;
    }

    .bg-success-light {
      background-color: rgba(76, 175, 80, 0.1);
      color: #2e7d32;
    }

    .bg-warning-light {
      background-color: rgba(255, 193, 7, 0.1);
      color: #ff8f00;
    }

    .bg-danger-light {
      background-color: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
    }
  `]
})
export class AdminDashboardComponent {
  loading = signal(false);
  
  topProducts = signal([
    {
      id: 1,
      name: 'Tailored Coat',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
      sales: 128,
      revenue: 30720
    },
    {
      id: 2,
      name: 'Oversized Blazer',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c5b',
      sales: 96,
      revenue: 15048
    },
    {
      id: 3,
      name: 'Leather Tote',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
      sales: 72,
      revenue: 22320
    },
    {
      id: 4,
      name: 'Linen Shirt',
      image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68',
      sales: 64,
      revenue: 7680
    },
    {
      id: 5,
      name: 'Slim Trousers',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
      sales: 58,
      revenue: 6960
    }
  ]);

  recentOrders = signal([
    {
      id: 'ORD-1024',
      customer: 'Emma Wilson',
      date: '2026-07-16',
      amount: 459.98,
      status: 'Completed'
    },
    {
      id: 'ORD-1023',
      customer: 'James Brown',
      date: '2026-07-15',
      amount: 310.00,
      status: 'Shipped'
    },
    {
      id: 'ORD-1022',
      customer: 'Sophia Miller',
      date: '2026-07-14',
      amount: 185.00,
      status: 'Processing'
    },
    {
      id: 'ORD-1021',
      customer: 'Michael Davis',
      date: '2026-07-13',
      amount: 632.50,
      status: 'Completed'
    },
    {
      id: 'ORD-1020',
      customer: 'Olivia Taylor',
      date: '2026-07-12',
      amount: 120.00,
      status: 'Cancelled'
    }
  ]);

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success-light';
      case 'shipped': return 'bg-primary bg-opacity-10 text-primary';
      case 'processing': return 'bg-warning-light';
      case 'cancelled': return 'bg-danger-light';
      default: return 'bg-light text-dark';
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
