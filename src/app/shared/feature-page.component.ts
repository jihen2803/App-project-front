import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="feature-page fade-up">
      <div class="hero-panel glass-card p-4 p-lg-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-6">
            <p class="section-eyebrow">{{ eyebrow() }}</p>
            <h1 class="hero-title">{{ title() }}</h1>
            <p class="section-copy hero-copy">{{ summary() }}</p>

            <div class="d-flex flex-wrap gap-3 mt-4">
              @if (actions().length) {
                @for (action of actions(); track action.label) {
                  <a class="btn-fashion-primary" [routerLink]="action.link">{{ action.label }}</a>
                }
              } @else {
                <a class="btn-fashion-primary" routerLink="/products">Browse products</a>
                <a class="btn-fashion-outline" routerLink="/auth/login">Sign in</a>
              }
            </div>

            <div class="row g-3 mt-4">
              @for (metric of heroMetrics; track metric.label) {
                <div class="col-sm-4">
                  <div class="stat-card p-3 h-100">
                    <span>{{ metric.label }}</span>
                    <strong>{{ metric.value }}</strong>
                    <small>{{ metric.note }}</small>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="col-lg-6">
            <div class="hero-visual float-soft">
              <img [src]="heroImage()" [alt]="title()" class="hero-image" />
              <div class="hero-badge glass-card p-3">
                <span class="badge-fashion">Atelier edit</span>
                <strong>Luxurious silhouettes, neutral tones, and curated essentials. jihen application</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      @if (isHome) {
        <div class="row g-4 mt-3">
          @for (tile of featureTiles; track tile.title) {
            <div class="col-md-4">
              <article class="glass-card p-4 h-100 feature-tile">
                <div class="feature-icon"><i [class]="'bi ' + tile.icon"></i></div>
                <h2>{{ tile.title }}</h2>
                <p>{{ tile.text }}</p>
              </article>
            </div>
          }
        </div>

        <div class="row g-4 mt-2">
          <div class="col-lg-7">
            <article class="glass-card promo-panel p-4 p-lg-5 h-100">
              <p class="section-eyebrow">Seasonal promotion</p>
              <h2 class="section-title mb-3">Soft tailoring, elevated essentials, and premium layering.</h2>
              <p class="section-copy mb-4">Build a refined fashion storefront with understated luxury, spacious layouts, and editorial product storytelling.</p>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge-fashion">New season</span>
                <span class="badge-fashion">Premium edit</span>
                <span class="badge-fashion">Curated classics</span>
              </div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="glass-card p-4 p-lg-5 h-100">
              <p class="section-eyebrow">Brands</p>
              <h2 class="section-title mb-3">Minimal labels with a luxury mood.</h2>
              <div class="brand-list">
                @for (brand of brands; track brand) {
                  <div class="brand-pill">{{ brand }}</div>
                }
              </div>
            </article>
          </div>
        </div>

        <div class="row g-4 mt-2">
          <div class="col-lg-7">
            <article class="glass-card p-4 p-lg-5 h-100">
              <div class="d-flex justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <p class="section-eyebrow mb-2">Customer testimonials</p>
                  <h2 class="section-title">Loved by modern shoppers.</h2>
                </div>
                <span class="badge-fashion">4.9 / 5</span>
              </div>
              <div class="row g-3">
                @for (testimonial of testimonials; track testimonial.name) {
                  <div class="col-md-4">
                    <div class="testimonial-card h-100">
                      <div class="stars mb-3">
                        @for (star of [1, 2, 3, 4, 5]; track star) {
                          <i class="bi bi-star-fill"></i>
                        }
                      </div>
                      <p>{{ testimonial.text }}</p>
                      <strong>{{ testimonial.name }}</strong>
                      <span>{{ testimonial.role }}</span>
                    </div>
                  </div>
                }
              </div>
            </article>
          </div>
          <div class="col-lg-5">
            <article class="glass-card p-4 p-lg-5 h-100 newsletter-card">
              <p class="section-eyebrow">Newsletter</p>
              <h2 class="section-title mb-3">Get curated launches and style notes.</h2>
              <p class="section-copy">A clean editorial layout for premium campaigns, launches, and student project presentation slides.</p>
              <form class="mt-4 d-flex flex-column gap-3">
                <input class="form-control" type="text" placeholder="Full name" />
                <input class="form-control" type="email" placeholder="Email address" />
                <button class="btn-fashion-primary" type="button">Subscribe</button>
              </form>
            </article>
          </div>
        </div>
      } @else {
        @if (points().length) {
          <div class="row g-4 mt-3">
            @for (point of points(); track point; let index = $index) {
              <div class="col-md-4">
                <article class="glass-card p-4 h-100 point-card">
                  <span class="point-index">0{{ index + 1 }}</span>
                  <h2>{{ point }}</h2>
                </article>
              </div>
            }
          </div>
        }

        @if (actions().length) {
          <div class="glass-card p-4 p-lg-5 mt-4 d-flex flex-wrap gap-3 align-items-center justify-content-between">
            <div>
              <p class="section-eyebrow mb-2">Next step</p>
              <h2 class="section-title">Continue exploring the store.</h2>
            </div>
            <div class="d-flex flex-wrap gap-3">
              @for (action of actions(); track action.label) {
                <a class="btn-fashion-primary" [routerLink]="action.link">{{ action.label }}</a>
              }
            </div>
          </div>
        }
      }
    </section>
  `,
  styles: [
    `
      .feature-page {
        padding-bottom: 1rem;
      }

      .hero-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.8rem, 5vw, 5.4rem);
        line-height: 0.94;
        letter-spacing: -0.04em;
      }

      .hero-copy {
        max-width: 62ch;
      }

      .hero-visual {
        position: relative;
      }

      .hero-image {
        width: 100%;
        min-height: 520px;
        object-fit: cover;
        border-radius: 32px;
      }

      .hero-badge {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
        max-width: 260px;
      }

      .hero-badge strong {
        display: block;
        margin-top: 0.6rem;
        font-size: 0.98rem;
        line-height: 1.5;
      }

      .stat-card span,
      .stat-card small {
        display: block;
        color: var(--muted);
        font-size: 0.75rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .stat-card strong {
        display: block;
        margin-top: 0.5rem;
        font-family: var(--font-display);
        font-size: 1.6rem;
      }

      .stat-card small {
        margin-top: 0.35rem;
        letter-spacing: 0.06em;
        text-transform: none;
      }

      .feature-tile,
      .testimonial-card,
      .point-card {
        border-radius: 24px;
        height: 100%;
      }

      .feature-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: rgba(17, 17, 17, 0.06);
        margin-bottom: 1rem;
        color: var(--ink);
      }

      .feature-tile h2,
      .point-card h2 {
        font-family: var(--font-display);
        font-size: 1.15rem;
        margin-bottom: 0.75rem;
      }

      .feature-tile p,
      .point-card p,
      .testimonial-card p {
        color: var(--ink-soft);
        line-height: 1.7;
        margin-bottom: 0;
      }

      .brand-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .brand-pill {
        padding: 0.75rem 1rem;
        border-radius: 999px;
        background: rgba(17, 17, 17, 0.04);
        font-weight: 600;
      }

      .testimonial-card {
        padding: 1.25rem;
        background: rgba(255, 255, 255, 0.72);
      }

      .testimonial-card .stars {
        color: var(--accent);
        display: flex;
        gap: 0.2rem;
      }

      .testimonial-card span {
        display: block;
        color: var(--muted);
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }

      .point-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.2rem;
        height: 2.2rem;
        margin-bottom: 1rem;
        border-radius: 50%;
        background: rgba(201, 162, 39, 0.14);
        color: var(--ink);
        font-size: 0.8rem;
        font-weight: 700;
      }

      @media (max-width: 860px) {
        .hero-image {
          min-height: 380px;
        }

        .hero-badge {
          position: static;
          margin-top: 1rem;
          max-width: none;
        }

        .hero-title {
          font-size: clamp(2.3rem, 9vw, 4rem);
        }
      }
    `,
  ],
})
export class FeaturePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly title = computed(() => (this.route.snapshot.data['title'] as string) ?? 'Atelier Noir');
  readonly eyebrow = computed(() => (this.route.snapshot.data['eyebrow'] as string) ?? 'Luxury fashion');
  readonly summary = computed(() => (this.route.snapshot.data['summary'] as string) ?? '');
  readonly points = computed(() => (this.route.snapshot.data['points'] as string[]) ?? []);
  readonly actions = computed(() => (this.route.snapshot.data['actions'] as Array<{ label: string; link: string }>) ?? []);

  readonly heroImage = computed(() => (this.route.snapshot.data['heroImage'] as string) ?? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80');
  readonly isHome = this.router.url === '/' || this.router.url === '/home';

  readonly heroMetrics = [
    { label: 'Curated styles', value: '240+', note: 'Seasonal wardrobe edits' },
    { label: 'Premium brands', value: '18', note: 'Refined label selection' },
    { label: 'Customer rating', value: '4.9', note: 'Editorial experience' },
  ];

  readonly featureTiles = [
    { title: 'Featured categories', text: 'Tailored navigation for women, men, accessories, and elevated essentials.', icon: 'bi-grid-1x2' },
    { title: 'Luxury product cards', text: 'Large imagery, rounded surfaces, elegant badges, and smooth hover states.', icon: 'bi-bag-heart' },
    { title: 'Responsive commerce', text: 'A flexible layout built with Bootstrap grid patterns for every screen size.', icon: 'bi-phone' },
  ];

  readonly brands = ['Zara-inspired', 'COS mood', 'Mango edit', 'Massimo Dutti', 'H&M Studio', 'Atelier Noir'];

  readonly testimonials = [
    { name: 'Lina', role: 'Fashion buyer', text: 'The interface feels polished, calm, and premium without looking copied.' },
    { name: 'Omar', role: 'Final-year reviewer', text: 'The typography, spacing, and cards make the project feel professionally designed.' },
    { name: 'Sara', role: 'UX student', text: 'It looks like a real commerce brand and the layout works beautifully on mobile.' },
  ];
}
