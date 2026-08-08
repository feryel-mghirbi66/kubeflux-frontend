import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout } from 'rxjs/operators';
import { StockService, Stock } from '../../services/stock';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-list.html',
  styleUrl: './stock-list.css'
})
export class StockList implements OnInit, OnDestroy {
  stocks: Stock[] = [];
  loading = true;
  error = '';
  private pollInterval?: ReturnType<typeof setInterval>;

  constructor(private stockService: StockService) {}

  ngOnInit() {
  console.log('StockList ngOnInit appelé, polling démarré');
  this.loadStock();
  this.pollInterval = setInterval(() => {
    console.log('Polling stock...');
    this.loadStock(true);
  }, 5000);
}

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadStock(silent = false) {
    if (!silent) this.loading = true;
    this.error = '';
    this.stockService.getStock().pipe(timeout(10000)).subscribe({
      next: (data) => { this.stocks = data; this.loading = false; },
      error: () => {
        if (!silent) { this.error = 'Impossible de charger le stock.'; this.loading = false; }
      }
    });
  }

  level(qty: number): string {
    if (qty <= 2) return 'low';
    if (qty <= 5) return 'medium';
    return 'high';
  }
}