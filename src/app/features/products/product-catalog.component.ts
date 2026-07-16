import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { ProductSummary } from '../../core/models/catalog.models';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <section class="catalog-page fade-up">
      <div class="glass-card p-4 p-lg-5 mb-4 catalog-hero">
        <div class="row g-4 align-items-end">
          <div class="col-lg-7">
            <p class="section-eyebrow">Catalog</p>
            <h1 class="catalog-title">Curated product catalog</h1>
            <p class="section-copy mb-0">
              Explore premium essentials, elegant silhouettes, and fashion-forward pieces powered by the live Spring Boot API.
            </p>
          </div>
          <div class="col-lg-5">
            <div class="row g-3">
              <div class="col-6">
                <div class="stat-card p-3 h-100">
                  <span>Total products</span>
                  <strong>{{ products().length }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-card p-3 h-100">
                  <span>Featured</span>
                  <strong>{{ featuredCount() }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="glass-card p-4 p-lg-5 text-center loading-panel">
          <div class="spinner-border" role="status" aria-label="Loading catalog"></div>
          <p class="mt-3 mb-0">Loading catalog...</p>
        </div>
      } @else if (products().length === 0) {
        <div class="glass-card p-4 p-lg-5 text-center loading-panel">
          <p class="mb-0">No products available yet.</p>
        </div>
      } @else {
        <div class="row g-4">
          @for (product of products(); track product.id) {
            <div class="col-sm-6 col-xl-4">
              <article class="product-card h-100">
                <div class="product-media">
                  @if (product.primaryImageUrl) {
                    <img [src]="product.primaryImageUrl" [alt]="product.name" />
                  } @else {
                    <div class="image-placeholder">Atelier Noir</div>
                  }

                  <div class="product-topbar">
                    <span class="badge-fashion">-{{ product.discountPercentage }}%</span>
                    <button class="wishlist-button" type="button" aria-label="Save to wishlist">
                      <i class="bi bi-heart"></i>
                    </button>
                  </div>
                </div>

                <div class="p-4 d-flex flex-column gap-3">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <p class="product-category mb-1">{{ product.category ?? 'Uncategorized' }}</p>
                      <h2 class="product-name mb-0">{{ product.name }}</h2>
                    </div>
                    <div class="text-end">
                      <strong class="product-price">{{ product.price | currency:'USD':'symbol':'1.0-0' }}</strong>
                      <div class="product-brand">{{ product.brand ?? 'Atelier Noir' }}</div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-2 product-rating" aria-label="Rating 4.8 out of 5">
                    @for (star of [1, 2, 3, 4]; track star) {
                      <i class="bi bi-star-fill"></i>
                    }
                    <i class="bi bi-star"></i>
                    <span>4.8</span>
                  </div>

                  <div class="product-tags">
                    @if (product.featured) {
                      <span>Featured</span>
                    }
                    @if (product.newArrival) {
                      <span>New</span>
                    }
                    @if (product.bestSeller) {
                      <span>Best seller</span>
                    }
                  </div>

                  <div class="d-flex gap-2 mt-auto flex-wrap">
                    <a class="btn-fashion-primary flex-fill" [routerLink]="['/products', product.slug]">Quick view</a>
                    <a class="btn-fashion-outline flex-fill" routerLink="/cart">Add to cart</a>
                  </div>
                </div>
              </article>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .catalog-page {
        padding-bottom: 1rem;
      }

      .catalog-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.6rem, 5vw, 5rem);
        line-height: 0.94;
        letter-spacing: -0.04em;
      }

      .loading-panel {
        min-height: 240px;
        display: grid;
        place-items: center;
      }

      .product-card {
        overflow: hidden;
        transition: transform 180ms ease, box-shadow 180ms ease;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 26px 60px rgba(17, 17, 17, 0.12);
      }

      .product-media {
        position: relative;
        min-height: 380px;
        overflow: hidden;
        background: linear-gradient(145deg, rgba(17, 17, 17, 0.08), rgba(17, 17, 17, 0.22));
      }

      .product-media img {
        width: 100%;
        height: 100%;
        min-height: 380px;
        object-fit: cover;
        transition: transform 260ms ease;
      }

      .product-card:hover .product-media img {
        transform: scale(1.04);
      }

      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 380px;
        color: rgba(255, 255, 255, 0.75);
        font-family: var(--font-display);
        font-size: 2rem;
        letter-spacing: 0.18em;
      }

      .product-topbar {
        position: absolute;
        inset: 1rem 1rem auto 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
      }

      .wishlist-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
        color: var(--ink);
        box-shadow: 0 12px 24px rgba(17, 17, 17, 0.1);
      }

      .product-category,
      .product-brand,
      .product-tags span {
        color: var(--muted);
        font-size: 0.75rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .product-name {
        font-family: var(--font-display);
        font-size: 1.25rem;
        line-height: 1.15;
      }

      .product-price {
        display: block;
        font-family: var(--font-display);
        font-size: 1.45rem;
      }

      .product-brand {
        display: block;
        margin-top: 0.15rem;
      }

      .product-rating {
        color: var(--accent);
      }

      .product-rating span {
        margin-left: 0.25rem;
        color: var(--ink-soft);
        font-weight: 600;
      }

      .product-tags {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        gap: 0.5rem;
      }

      .product-tags span {
        padding: 0.4rem 0.65rem;
        border-radius: 999px;
        background: rgba(17, 17, 17, 0.05);
      }

      @media (max-width: 575.98px) {
        .catalog-title {
          font-size: clamp(2.2rem, 10vw, 3.2rem);
        }

        .product-media,
        .product-media img,
        .image-placeholder {
          min-height: 320px;
        }
      }
    `,
  ],
})
export class ProductCatalogComponent implements OnInit {
  private readonly catalogApiService = inject(CatalogApiService);

  readonly products = signal<ProductSummary[]>([]);
  readonly loading = signal(true);
  readonly featuredCount = computed(() => this.products().filter((product) => product.featured).length);

  ngOnInit(): void {
    this.catalogApiService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
