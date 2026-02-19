import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    if (!this.email || !this.password) {
      this.loginError = 'Email and password are required';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (data: any) => {
        // Handle successful login
        this.router.navigate(['/products']);
      },
      (error: any) => {
        this.loginError = 'Invalid email or password';
      }
    );
  }
}