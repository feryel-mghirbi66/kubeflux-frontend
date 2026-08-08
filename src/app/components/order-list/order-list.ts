import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeout, retry } from 'rxjs/operators';
import { OrderService, Order } from '../../services/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  error = '';

  pendingDeleteId: string | null = null;
  deleting = false;
  private pollInterval?: ReturnType<typeof setInterval>;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.pollInterval = setInterval(() => this.loadOrders(true), 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadOrders(silent = false) {
    if (!silent) this.loading = true;
    this.error = '';
    this.orderService.getOrders().pipe(timeout(10000), retry(1)).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        if (!silent) {
          this.error = 'Impossible de charger les commandes.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  askDelete(orderId: string) {
    this.pendingDeleteId = orderId;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
  }

  confirmDelete() {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.deleting = true;

    this.orderService.deleteOrder(id).pipe(timeout(10000)).subscribe({
      next: () => {
        this.deleting = false;
        this.pendingDeleteId = null;
        this.loadOrders();
      },
      error: () => {
        this.error = 'Suppression impossible — réessayez.';
        this.deleting = false;
        this.pendingDeleteId = null;
        this.cdr.detectChanges();
      }
    });
  }
}