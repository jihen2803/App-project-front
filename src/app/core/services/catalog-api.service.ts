import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductDetail, ProductSummary } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  getProducts(): Observable<ProductSummary[]> {
    return this.http.get<ProductSummary[]>(`${this.baseUrl}/products`);
  }

  getProduct(slug: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/products/${slug}`);
  }

  getFeaturedProducts(limit = 4): Observable<ProductSummary[]> {
    return this.getProducts().pipe(map((products) => products.slice(0, limit)));
  }
}
