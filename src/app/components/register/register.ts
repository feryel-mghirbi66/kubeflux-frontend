import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/login.css'
})
export class Register {
  email = '';
  password = '';
  role = 'USER';
  message = '';
  success = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    this.loading = true;
    this.message = '';

    this.authService.register(this.email, this.password, this.role).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.message = 'Compte créé. Redirection vers la connexion...';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = err.error?.message || 'Cet email est déjà utilisé.';
        this.cdr.detectChanges();
      }
    });
  }
}
