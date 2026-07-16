import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistResponse } from '../models/wishlist.models';

@Injectable({ providedIn: 'root' })
export class WishlistApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/wishlist';

  getWishlist(): Observable<WishlistResponse> {
    return this.http.get<WishlistResponse>(this.base);
  }

  addToWishlist(productId: number): Observable<WishlistResponse> {
    return this.http.post<WishlistResponse>(this.base, { productId });
  }

  removeFromWishlist(productId: number): Observable<WishlistResponse> {
    return this.http.delete<WishlistResponse>(`${this.base}/${productId}`);
  }

  clearWishlist(): Observable<WishlistResponse> {
    return this.http.delete<WishlistResponse>(`${this.base}/clear`);
  }
}
