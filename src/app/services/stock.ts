import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  productId: string;
  quantityAvailable: number;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = 'http://192.168.192.122:30082/stock';

  constructor(private http: HttpClient) {}

  getStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.baseUrl);
  }

  saveStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.baseUrl, stock);
  }

  deleteStock(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }
}