import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./shared/feature-page.component').then((m) => m.FeaturePageComponent),
    data: {
      eyebrow: 'Luxury fashion commerce',
      title: 'Minimal silhouettes, premium detail, and a storefront built to scale.',
      summary:
        'A Zara-inspired Angular experience for curated apparel, accessories, and editorial product storytelling.',
      points: ['Editorial home experience', 'Featured collections', 'Responsive commerce structure'],
      actions: [
        { label: 'Browse products', link: '/products' },
        { label: 'Explore auth', link: '/auth/login' },
      ],
    },
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-catalog.component').then((m) => m.ProductCatalogComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/products/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./features/auth/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./shared/feature-page.component').then((m) => m.FeaturePageComponent),
    data: {
      eyebrow: 'Access denied',
      title: '403 Forbidden',
      summary: 'Your account does not have permission to access this page.',
      points: ['Check your role', 'Return to the store', 'Contact admin if needed'],
      actions: [{ label: 'Go home', link: '/' }],
    },
  },
  {
    path: '**',
    loadComponent: () => import('./shared/feature-page.component').then((m) => m.FeaturePageComponent),
    data: {
      eyebrow: 'Not found',
      title: '404 Page not found',
      summary: 'The requested page does not exist or was moved.',
      points: ['Check the URL', 'Return to the store', 'Browse featured products'],
      actions: [{ label: 'Back to home', link: '/' }],
    },
  },
];
