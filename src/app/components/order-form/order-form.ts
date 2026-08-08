import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { OrderService, Order } from '../../services/order';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css'
})
export class OrderForm {
  order: Order = { productId: '', quantity: 1, customerId: '' };
  message = '';
  success = false;
  saving = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    this.saving = true;
    this.message = '';

    this.orderService.createOrder(this.order).pipe(timeout(10000)).subscribe({
      next: (res) => {
        this.message = `Commande créée — ID ${res.orderId}`;
        this.success = true;
        this.saving = false;
        this.order = { productId: '', quantity: 1, customerId: '' };
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Échec de la création. Vérifiez les champs et réessayez.';
        this.success = false;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}