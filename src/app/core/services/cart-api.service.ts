import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddToCartRequest,
  ApplyCouponRequest,
  CartResponse,
  UpdateCartItemRequest
} from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/cart';

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.base);
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(this.base, request);
  }

  updateCartItem(request: UpdateCartItemRequest): Observable<CartResponse> {
    return this.http.put<CartResponse>(this.base, request);
  }

  removeCartItem(productId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.base}/${productId}`);
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.base}/clear`);
  }

  applyCoupon(request: ApplyCouponRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.base}/apply-coupon`, request);
  }
}
