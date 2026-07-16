import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { ProductDetail } from '../../core/models/catalog.models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  template: `
    <section class="detail-page fade-up">
      @if (loading()) {
        <div class="glass-card p-4 p-lg-5 text-center loading-panel">
          <div class="spinner-border" role="status" aria-label="Loading product"></div>
          <p class="mt-3 mb-0">Loading product...</p>
        </div>
      } @else if (product()) {
        @let item = product()!;
        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <article class="glass-card p-3 p-lg-4 gallery-shell">
              <div class="gallery-main">
                @if (item.images.length) {
                  <img [src]="selectedImageUrl()" [alt]="item.name" class="gallery-image" />
                } @else {
                  <div class="placeholder">Atelier Noir</div>
                }
                <span class="badge-fashion gallery-badge">Editor&apos;s pick</span>
              </div>

              @if (item.images.length > 1) {
                <div class="thumb-row mt-3">
                  @for (image of item.images; track image; let index = $index) {
                    <button
                      type="button"
                      class="thumb-button"
                      [class.active]="selectedImageIndex() === index"
                      (click)="selectImage(index)"
                      [attr.aria-label]="'View image ' + (index + 1)"
                    >
                      <img [src]="image" [alt]="item.name + ' thumbnail ' + (index + 1)" />
                    </button>
                  }
                </div>
              }
            </article>
          </div>

          <div class="col-lg-5">
            <article class="glass-card p-4 p-lg-5 detail-copy">
              <p class="section-eyebrow">{{ item.category ?? 'Catalog' }}</p>
              <h1 class="detail-title">{{ item.name }}</h1>
              <p class="section-copy">{{ item.description }}</p>

              <div class="price-row d-flex align-items-end justify-content-between gap-3 mt-4">
                <div>
                  <span class="price-label">Price</span>
                  <strong class="price-value">{{ item.price | currency:'USD':'symbol':'1.0-0' }}</strong>
                </div>
                <div class="text-end">
                  <span class="price-label">Rating</span>
                  <div class="rating-value">{{ item.averageRating | number:'1.0-1' }}/5</div>
                  <small class="rating-meta">{{ item.reviewCount }} reviews</small>
                </div>
              </div>

              <div class="detail-stats row g-3 mt-4">
                <div class="col-4">
                  <div class="stat-card p-3 h-100">
                    <span>Stock</span>
                    <strong>{{ item.stockQuantity }}</strong>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-card p-3 h-100">
                    <span>Status</span>
                    <strong>{{ item.status }}</strong>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-card p-3 h-100">
                    <span>Gender</span>
                    <strong>{{ item.gender }}</strong>
                  </div>
                </div>
              </div>

              <div class="selector-block mt-4">
                <p class="selector-title mb-3">Sizes</p>
                <div class="selector-group">
                  @for (size of item.sizes; track size) {
                    <button type="button" class="selector-pill" [class.active]="selectedSize() === size" (click)="selectedSize.set(size)">{{ size }}</button>
                  }
                </div>
              </div>

              <div class="selector-block mt-4">
                <p class="selector-title mb-3">Colors</p>
                <div class="selector-group">
                  @for (color of item.colors; track color) {
                    <button type="button" class="selector-pill selector-pill--color" [class.active]="selectedColor() === color" (click)="selectedColor.set(color)">{{ color }}</button>
                  }
                </div>
              </div>

              <div class="selector-block mt-4">
                <p class="selector-title mb-3">Quantity</p>
                <div class="quantity-control">
                  <button type="button" (click)="decreaseQuantity()" aria-label="Decrease quantity"><i class="bi bi-dash"></i></button>
                  <input type="text" [value]="quantity()" readonly />
                  <button type="button" (click)="increaseQuantity()" aria-label="Increase quantity"><i class="bi bi-plus"></i></button>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-3 mt-4">
                <button class="btn-fashion-primary flex-grow-1" type="button">Add to cart</button>
                <button class="btn-fashion-outline flex-grow-1" type="button">Wishlist</button>
              </div>

              <div class="meta-list mt-4">
                <p><strong>Brand:</strong> {{ item.brand ?? 'Atelier Noir' }}</p>
                <p><strong>Discount:</strong> {{ item.discountPercentage | number:'1.0-0' }}%</p>
                <p><strong>SKU mood:</strong> Premium minimalist collection</p>
              </div>
            </article>
          </div>
        </div>

        <div class="row g-4 mt-2">
          <div class="col-lg-7">
            <article class="glass-card p-4 p-lg-5">
              <p class="section-eyebrow">Reviews</p>
              <h2 class="section-title mb-4">Customer notes</h2>
              <div class="review-list d-grid gap-3">
                @for (review of reviews; track review.author) {
                  <div class="review-card">
                    <div class="d-flex justify-content-between gap-3 align-items-start mb-2">
                      <div>
                        <strong>{{ review.author }}</strong>
                        <p class="mb-0">{{ review.role }}</p>
                      </div>
                      <span class="badge-fashion">{{ review.rating }}/5</span>
                    </div>
                    <p class="mb-0">{{ review.text }}</p>
                  </div>
                }
              </div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="glass-card p-4 p-lg-5 h-100">
              <p class="section-eyebrow">Related products</p>
              <h2 class="section-title mb-4">Style suggestions</h2>
              <div class="related-list d-grid gap-3">
                @for (related of relatedStyles; track related.title) {
                  <a class="related-card" routerLink="/products">
                    <img [src]="related.image" [alt]="related.title" />
                    <div>
                      <strong>{{ related.title }}</strong>
                      <p>{{ related.text }}</p>
                    </div>
                  </a>
                }
              </div>
            </article>
          </div>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .detail-page {
        padding-bottom: 1rem;
      }

      .loading-panel {
        min-height: 240px;
        display: grid;
        place-items: center;
      }

      .gallery-main {
        position: relative;
        overflow: hidden;
        border-radius: 28px;
        background: linear-gradient(145deg, rgba(17, 17, 17, 0.06), rgba(17, 17, 17, 0.18));
      }

      .gallery-image {
        width: 100%;
        min-height: 680px;
        object-fit: cover;
      }

      .placeholder {
        display: grid;
        place-items: center;
        min-height: 680px;
        font-family: var(--font-display);
        font-size: clamp(2rem, 4vw, 4rem);
        letter-spacing: 0.18em;
      }

      .gallery-badge {
        position: absolute;
        left: 1rem;
        top: 1rem;
      }

      .thumb-row {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
      }

      .thumb-button {
        flex: 0 0 auto;
        width: 84px;
        height: 110px;
        border: 1px solid rgba(17, 17, 17, 0.1);
        border-radius: 20px;
        overflow: hidden;
        padding: 0;
        background: #fff;
        opacity: 0.72;
        transition: transform 180ms ease, opacity 180ms ease, border-color 180ms ease;
      }

      .thumb-button.active {
        opacity: 1;
        border-color: rgba(201, 162, 39, 0.48);
        transform: translateY(-2px);
      }

      .thumb-button img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .detail-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.4rem, 4vw, 4.4rem);
        line-height: 0.94;
        letter-spacing: -0.04em;
      }

      .price-label,
      .selector-title {
        display: grid;
        color: var(--muted);
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .price-value {
        display: block;
        margin-top: 0.25rem;
        font-family: var(--font-display);
        font-size: 2rem;
      }

      .rating-value {
        font-weight: 700;
        font-size: 1.1rem;
      }

      .rating-meta,
      .meta-list p,
      .review-card p {
        color: var(--ink-soft);
      }

      .detail-stats .stat-card span {
        display: block;
        color: var(--muted);
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .detail-stats .stat-card strong {
        display: block;
        margin-top: 0.5rem;
        font-family: var(--font-display);
        font-size: 1.2rem;
      }

      .selector-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .selector-pill {
        min-width: 56px;
        min-height: 48px;
        padding: 0 1rem;
        border: 1px solid rgba(17, 17, 17, 0.12);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.88);
        transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
      }

      .selector-pill.active {
        border-color: rgba(201, 162, 39, 0.5);
        background: rgba(201, 162, 39, 0.1);
        transform: translateY(-1px);
      }

      .quantity-control {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem;
        border-radius: 999px;
        border: 1px solid rgba(17, 17, 17, 0.12);
        background: rgba(255, 255, 255, 0.88);
      }

      .quantity-control button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.6rem;
        height: 2.6rem;
        border: 0;
        border-radius: 50%;
        background: rgba(17, 17, 17, 0.04);
      }

      .quantity-control input {
        width: 3rem;
        border: 0;
        background: transparent;
        text-align: center;
        font-weight: 700;
      }

      .meta-list {
        display: grid;
        gap: 0.4rem;
      }

      .meta-list p {
        margin: 0;
        line-height: 1.75;
      }

      .review-card {
        padding: 1.25rem;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.66);
        border: 1px solid rgba(17, 17, 17, 0.08);
      }

      .review-card strong {
        display: block;
        font-size: 1rem;
      }

      .review-card p {
        margin: 0;
        line-height: 1.65;
      }

      .related-card {
        display: grid;
        grid-template-columns: 92px minmax(0, 1fr);
        gap: 0.9rem;
        align-items: center;
        padding: 0.85rem;
        border-radius: 20px;
        background: rgba(17, 17, 17, 0.03);
        border: 1px solid rgba(17, 17, 17, 0.06);
        text-decoration: none;
        color: inherit;
        transition: transform 180ms ease, background-color 180ms ease;
      }

      .related-card:hover {
        transform: translateY(-2px);
        background: rgba(201, 162, 39, 0.08);
      }

      .related-card img {
        width: 92px;
        height: 92px;
        object-fit: cover;
        border-radius: 18px;
      }

      .related-card strong {
        display: block;
        font-size: 1rem;
        margin-bottom: 0.35rem;
      }

      .related-card p {
        margin: 0;
        color: var(--ink-soft);
        line-height: 1.5;
      }

      @media (max-width: 1180px) {
        .gallery-image,
        .placeholder {
          min-height: 520px;
        }
      }

      @media (max-width: 860px) {
        .gallery-image,
        .placeholder {
          min-height: 380px;
        }

        .detail-title {
          font-size: clamp(2.1rem, 8vw, 3.4rem);
        }

        .detail-stats .col-4 {
          flex: 0 0 100%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogApiService = inject(CatalogApiService);

  readonly product = signal<ProductDetail | null>(null);
  readonly loading = signal(true);
  readonly selectedImageIndex = signal(0);
  readonly quantity = signal(1);
  readonly selectedSize = signal<string | null>(null);
  readonly selectedColor = signal<string | null>(null);
  readonly selectedImageUrl = signal('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80');

  readonly reviews = [
    { author: 'Mila', role: 'Styling enthusiast', rating: 5, text: 'The fabric quality and cut feel premium, and the page presentation makes it easy to trust the product.' },
    { author: 'Adam', role: 'Store visitor', rating: 4.8, text: 'A clean product page with elegant spacing and a strong luxury-brand mood.' },
    { author: 'Hana', role: 'Fashion student', rating: 5, text: 'It looks like a commercial fashion store while still feeling original and tailored to the project.' },
  ];

  readonly relatedStyles = [
    { title: 'Soft tailoring', text: 'Minimal separates with a refined silhouette.', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' },
    { title: 'Weekend essentials', text: 'Easy layers in neutral tones.', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
    { title: 'Evening edit', text: 'Luxurious finishing touches for occasion wear.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
  ];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.loading.set(false);
      return;
    }

    this.catalogApiService.getProduct(slug).subscribe({
      next: (product) => {
        this.product.set(product);
        this.selectedImageIndex.set(0);
        this.selectedImageUrl.set(product.images[0] ?? this.selectedImageUrl());
        this.selectedSize.set(product.sizes[0] ?? null);
        this.selectedColor.set(product.colors[0] ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    const item = this.product();
    if (!item?.images.length) {
      return;
    }

    this.selectedImageIndex.set(index);
    this.selectedImageUrl.set(item.images[index] ?? item.images[0]);
  }

  increaseQuantity(): void {
    this.quantity.update((value) => value + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }
}
