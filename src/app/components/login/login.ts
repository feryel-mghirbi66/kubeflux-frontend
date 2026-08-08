import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  message = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.message = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        const target = this.authService.isStockManager() ? '/stock-manager' : '/orders';
        this.router.navigate([target]);
      },
      error: () => {
        this.loading = false;
        this.message = 'Email ou mot de passe incorrect.';
      }
    });
  }
}