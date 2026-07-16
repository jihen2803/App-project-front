import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="app-shell">
      <div class="announcement-bar">
        <div class="container-xxl d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>Premium fashion experience for the final project showcase</span>
          <span>Free shipping on orders over $120 · Easy returns · Secure checkout</span>
        </div>
      </div>

      <header class="site-header sticky-top">
        <div class="container-xxl">
          <nav class="navbar navbar-expand-lg navbar-light site-nav glass-card px-3 px-lg-4 py-3">
            <a class="navbar-brand brand-mark d-flex align-items-center gap-2" routerLink="/" aria-label="Atelier Noir home">
              <span class="brand-mark__icon"><i class="bi bi-bag-heart"></i></span>
              <span>
                <small>Atelier</small>
                Noir
              </span>
            </a>

            <button
              class="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#primaryNav"
              aria-controls="primaryNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="primaryNav">
              <ul class="navbar-nav mx-lg-auto align-items-lg-center gap-lg-2 mb-3 mb-lg-0">
                <li class="nav-item"><a class="nav-link" routerLink="/">Home</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/products">Shop</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/wishlist">Wishlist</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/orders">Orders</a></li>
                <li class="nav-item"><a class="nav-link" routerLink="/admin">Admin</a></li>
              </ul>

              <form class="search-box d-flex align-items-center me-lg-3 mb-3 mb-lg-0" role="search" aria-label="Search store">
                <i class="bi bi-search"></i>
                <input type="search" class="form-control border-0" placeholder="Search the collection" aria-label="Search the collection" />
              </form>

              <div class="header-actions d-flex flex-wrap align-items-center gap-2">
                <a class="icon-button" routerLink="/wishlist" aria-label="Wishlist">
                  <i class="bi bi-heart"></i>
                  <span class="badge rounded-pill text-bg-light">4</span>
                </a>
                <a class="icon-button" routerLink="/cart" aria-label="Cart">
                  <i class="bi bi-bag"></i>
                  <span class="badge rounded-pill text-bg-light">2</span>
                </a>

                <details class="account-menu">
                  <summary class="icon-button account-trigger">
                    <i class="bi bi-person"></i>
                    <span class="d-none d-xl-inline">Account</span>
                  </summary>
                  <div class="account-panel glass-card">
                    <a routerLink="/profile"><i class="bi bi-person-lines-fill me-2"></i>Profile</a>
                    <a routerLink="/orders"><i class="bi bi-receipt me-2"></i>Orders</a>
                    <a routerLink="/wishlist"><i class="bi bi-heart me-2"></i>Wishlist</a>
                    <div class="account-panel__divider"></div>
                    <a routerLink="/auth/login"><i class="bi bi-box-arrow-in-right me-2"></i>Login</a>
                    <a routerLink="/auth/register"><i class="bi bi-person-plus me-2"></i>Register</a>
                  </div>
                </details>

                <a class="btn-fashion-outline d-none d-lg-inline-flex" routerLink="/auth/login">Login</a>
                <a class="btn-fashion-primary d-none d-lg-inline-flex" routerLink="/auth/register">Register</a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main class="content-shell container-xxl py-4 py-lg-5">
        <router-outlet />
      </main>

      <footer class="site-footer">
        <div class="container-xxl">
          <div class="glass-card footer-panel p-4 p-lg-5">
            <div class="row g-4 align-items-start">
              <div class="col-lg-4">
                <a class="brand-mark brand-mark--footer d-inline-flex align-items-center gap-2 mb-3" routerLink="/">
                  <span class="brand-mark__icon"><i class="bi bi-bag-heart"></i></span>
                  <span>
                    <small>Atelier</small>
                    Noir
                  </span>
                </a>
                <p class="footer-copy mb-0">An elegant fashion storefront designed for a polished university presentation and a professional shopping experience.</p>
              </div>

              <div class="col-6 col-lg-2">
                <h2 class="footer-title">Shop</h2>
                <ul class="footer-links list-unstyled mb-0">
                  <li><a routerLink="/products">New arrivals</a></li>
                  <li><a routerLink="/products">Best sellers</a></li>
                  <li><a routerLink="/wishlist">Wishlist</a></li>
                  <li><a routerLink="/cart">Cart</a></li>
                </ul>
              </div>

              <div class="col-6 col-lg-2">
                <h2 class="footer-title">Company</h2>
                <ul class="footer-links list-unstyled mb-0">
                  <li><a routerLink="/profile">Profile</a></li>
                  <li><a routerLink="/orders">Orders</a></li>
                  <li><a routerLink="/admin">Dashboard</a></li>
                  <li><a routerLink="/checkout">Checkout</a></li>
                </ul>
              </div>

              <div class="col-lg-4">
                <h2 class="footer-title">Newsletter</h2>
                <p class="footer-copy">Subscribe for seasonal drops, styling inspiration, and product highlights.</p>
                <form class="d-flex gap-2 flex-column flex-sm-row" role="newsletter">
                  <input class="form-control" type="email" placeholder="Email address" aria-label="Newsletter email" />
                  <button class="btn-fashion-primary" type="button">Join</button>
                </form>
              </div>
            </div>

            <div class="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-4">
              <span>© 2026 Atelier Noir. Crafted for a premium Angular showcase.</span>
              <div class="footer-social d-flex align-items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="https://pinterest.com" target="_blank" rel="noopener" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
                <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        color: var(--ink);
      }

      .app-shell {
        min-height: 100vh;
      }

      .announcement-bar {
        border-bottom: 1px solid rgba(17, 17, 17, 0.06);
        background: rgba(255, 255, 255, 0.56);
        color: var(--ink-soft);
        font-size: 0.82rem;
        letter-spacing: 0.02em;
        padding: 0.8rem 0;
        backdrop-filter: blur(12px);
      }

      .site-header {
        top: 0;
        z-index: 1030;
        padding: 0.85rem 0;
      }

      .site-nav {
        border-radius: 26px;
      }

      .brand-mark {
        color: var(--ink);
        text-decoration: none;
        font-family: var(--font-display);
        font-size: 1.15rem;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .brand-mark small {
        display: block;
        font-size: 0.56rem;
        letter-spacing: 0.32em;
        color: var(--muted);
        margin-bottom: 0.25rem;
      }

      .brand-mark__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 50%;
        background: linear-gradient(145deg, rgba(17, 17, 17, 0.94), rgba(66, 58, 42, 0.95));
        color: #fff;
        box-shadow: 0 14px 28px rgba(17, 17, 17, 0.18);
      }

      .navbar-nav .nav-link {
        color: var(--ink);
        font-weight: 500;
        padding: 0.85rem 0.95rem;
        border-radius: 999px;
        transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
      }

      .navbar-nav .nav-link:hover,
      .navbar-nav .nav-link:focus {
        background: rgba(17, 17, 17, 0.05);
        color: var(--ink);
        transform: translateY(-1px);
      }

      .search-box {
        min-width: min(100%, 320px);
        padding: 0 1rem;
        border-radius: 999px;
        border: 1px solid rgba(17, 17, 17, 0.08);
        background: rgba(255, 255, 255, 0.92);
      }

      .search-box i {
        color: var(--muted);
      }

      .search-box .form-control {
        box-shadow: none;
        background: transparent;
      }

      .search-box .form-control::placeholder {
        color: var(--muted);
      }

      .header-actions {
        margin-left: auto;
      }

      .icon-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        min-height: 48px;
        padding: 0.8rem 1rem;
        border-radius: 999px;
        color: var(--ink);
        text-decoration: none;
        border: 1px solid rgba(17, 17, 17, 0.08);
        background: rgba(255, 255, 255, 0.88);
        transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
      }

      .icon-button:hover {
        transform: translateY(-1px);
        border-color: rgba(17, 17, 17, 0.18);
        box-shadow: 0 14px 26px rgba(17, 17, 17, 0.08);
      }

      .icon-button .badge {
        position: absolute;
        top: -0.15rem;
        right: -0.15rem;
        border: 1px solid #fff;
      }

      .account-menu {
        position: relative;
      }

      .account-menu > summary {
        list-style: none;
      }

      .account-menu > summary::-webkit-details-marker {
        display: none;
      }

      .account-panel {
        position: absolute;
        top: calc(100% + 0.85rem);
        right: 0;
        min-width: 220px;
        padding: 0.6rem;
        border-radius: 22px;
        z-index: 10;
      }

      .account-panel a {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.8rem 0.9rem;
        border-radius: 16px;
        color: var(--ink);
        text-decoration: none;
        transition: background-color 180ms ease, transform 180ms ease;
      }

      .account-panel a:hover {
        background: rgba(17, 17, 17, 0.05);
        transform: translateX(2px);
      }

      .account-panel__divider {
        height: 1px;
        margin: 0.4rem 0;
        background: rgba(17, 17, 17, 0.08);
      }

      .content-shell {
        position: relative;
        z-index: 1;
      }

      .site-footer {
        padding: 0 0 2rem;
      }

      .footer-panel {
        overflow: hidden;
      }

      .footer-title {
        margin: 0 0 1rem;
        font-size: 0.85rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: var(--muted);
      }

      .footer-copy {
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .footer-links a {
        display: inline-block;
        padding: 0.3rem 0;
        color: var(--ink);
        text-decoration: none;
        transition: color 180ms ease, transform 180ms ease;
      }

      .footer-links a:hover {
        color: var(--accent);
        transform: translateX(2px);
      }

      .footer-bottom {
        border-top: 1px solid rgba(17, 17, 17, 0.08);
        color: var(--muted);
        font-size: 0.9rem;
      }

      .footer-social a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        color: var(--ink);
        background: rgba(17, 17, 17, 0.04);
        text-decoration: none;
        transition: transform 180ms ease, background-color 180ms ease;
      }

      .footer-social a:hover {
        transform: translateY(-1px);
        background: rgba(201, 162, 39, 0.12);
      }

      @media (max-width: 991.98px) {
        .site-nav {
          border-radius: 24px;
        }

        .search-box {
          width: 100%;
          min-width: 0;
        }

        .header-actions {
          width: 100%;
        }
      }

      @media (max-width: 575.98px) {
        .announcement-bar {
          font-size: 0.76rem;
        }

        .footer-bottom {
          padding-top: 1rem;
        }
      }
    `,
  ],
})
export class AppComponent {}
