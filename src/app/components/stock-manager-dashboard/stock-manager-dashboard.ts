import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { StockService, Stock } from '../../services/stock';

@Component({
  selector: 'app-stock-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-manager-dashboard.html',
  styleUrl: './stock-manager-dashboard.css'
})
export class StockManagerDashboard implements OnInit {
  stocks: Stock[] = [];
  loading = true;
  error = '';

  productId = '';
  quantity = 0;
  editingExisting = false;
  message = '';
  success = false;
  saving = false;

  pendingDeleteId: string | null = null;
  deleting = false;

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStock();
  }

  loadStock() {
    this.loading = true;
    this.stockService.getStock().pipe(timeout(10000)).subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Impossible de charger le stock.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editProduct(stock: Stock) {
    this.productId = stock.productId;
    this.quantity = stock.quantityAvailable;
    this.editingExisting = true;
    this.message = '';
  }

  resetForm() {
    this.productId = '';
    this.quantity = 0;
    this.editingExisting = false;
    this.message = '';
  }

  level(qty: number): string {
    if (qty <= 2) return 'low';
    if (qty <= 5) return 'medium';
    return 'high';
  }

  submit() {
    if (!this.productId) return;
    this.saving = true;
    this.message = '';

    this.stockService.saveStock({
      productId: this.productId,
      quantityAvailable: this.quantity
    }).pipe(timeout(10000)).subscribe({
      next: (saved) => {
        this.saving = false;
        this.success = true;
        this.message = `Stock mis à jour pour « ${saved.productId} ».`;
        this.resetForm();
        this.loadStock();
      },
      error: (err) => {
        this.saving = false;
        this.success = false;
        this.message = err.name === 'TimeoutError'
          ? 'Le serveur met trop de temps à répondre — réessayez.'
          : (err.status === 403 ? 'Accès refusé.' : 'Une erreur est survenue.');
        this.cdr.detectChanges();
      }
    });
  }

  askDelete(productId: string) {
    this.pendingDeleteId = productId;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.deleting = true;

    this.stockService.deleteStock(id).pipe(timeout(10000)).subscribe({
      next: () => {
        this.message = `« ${id} » supprimé.`;
        this.success = true;
        this.deleting = false;
        this.pendingDeleteId = null;
        this.loadStock();
      },
      error: () => {
        this.message = 'Suppression impossible.';
        this.success = false;
        this.deleting = false;
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      }
    });
  }
}