import { Routes } from '@angular/router';
import { OrderForm } from './components/order-form/order-form';
import { OrderList } from './components/order-list/order-list';
import { StockList } from './components/stock-list/stock-list';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { StockManagerDashboard } from './components/stock-manager-dashboard/stock-manager-dashboard';
import { stockManagerGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'orders/new', component: OrderForm },
  { path: 'orders', component: OrderList },
  { path: 'stock', component: StockList },
  { path: 'stock-manager', component: StockManagerDashboard, canActivate: [stockManagerGuard] }
];