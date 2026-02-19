import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private registeredUsers = [
    {
      email: 'user@example.com',
      password: 'password',
      firstName: 'Demo',
      lastName: 'User'
    }
  ];

  constructor(private router: Router) {
    // Load registered users from localStorage if available
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
      this.registeredUsers = JSON.parse(stored);
    }
  }

  signup(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    // Check if email already exists
    const userExists = this.registeredUsers.some(u => u.email === email);
    if (userExists) {
      return throwError('Email already registered');
    }

    // Add new user
    this.registeredUsers.push({ firstName, lastName, email, password });
    localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));

    return of({ 
      success: true, 
      message: 'User registered successfully',
      user: { firstName, lastName, email }
    });
  }

  login(email: string, password: string): Observable<any> {
    // Check if user exists in registered users
    const user = this.registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.isAuthenticated = true;
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ firstName: user.firstName, lastName: user.lastName, email: user.email }));
      return of({ success: true, message: 'Login successful', user });
    }
    return throwError('Invalid email or password');
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('authenticated');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const auth = localStorage.getItem('authenticated');
    return this.isAuthenticated || auth === 'true';
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}