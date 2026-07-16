import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <h1>Checkout</h1>
          <p class="text-muted">Checkout functionality coming soon.</p>
          <a routerLink="/cart" class="btn btn-primary">Back to Cart</a>
        </div>
      </div>
    </div>
  `
})
export class SimpleCheckoutComponent {}