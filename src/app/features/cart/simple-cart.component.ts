import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <h1>Shopping Cart</h1>
          <p class="text-muted">Your cart is currently empty.</p>
          <a routerLink="/products" class="btn btn-primary">Browse Products</a>
        </div>
      </div>
    </div>
  `
})
export class SimpleCartComponent {}