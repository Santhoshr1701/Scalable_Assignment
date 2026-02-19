import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  submitted = false;
  signupError: string = '';
  signupSuccess: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.submitted = true;
    this.signupError = '';
    this.signupSuccess = '';

    // Validation
    if (!this.email || !this.password || !this.confirmPassword || !this.firstName || !this.lastName) {
      this.signupError = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.signupError = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.signupError = 'Password must be at least 6 characters long';
      return;
    }

    // Register user
    this.authService.signup(this.firstName, this.lastName, this.email, this.password).subscribe(
      (data: any) => {
        this.signupSuccess = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error: any) => {
        this.signupError = 'Email already registered or signup failed';
      }
    );
  }
}
