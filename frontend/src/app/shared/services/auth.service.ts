import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { ILoggedInUser } from '../interfaces/logged-in-user.interface';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedInUser = signal<ILoggedInUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !this.isTokenExpired(token)) {
      this.loggedInUser.set(jwtDecode<ILoggedInUser>(token));
    }

    effect(() => {
      console.log('Auth state:', this.loggedInUser());
    });
  }

  googleLogin(idToken: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiURL}/auth/google-auth`, { token: idToken })
      .subscribe({
        next: (res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.loggedInUser.set(jwtDecode<ILoggedInUser>(res.token));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('Google login failed', err),
      });
  }

  demoLogin(role: 'admin' | 'manager' | 'employee') {
    return this.http
      .post<{ token: string }>(`${environment.apiURL}/auth/demo-login`, { role })
      .subscribe({
        next: (res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.loggedInUser.set(jwtDecode<ILoggedInUser>(res.token));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('Demo login failed', err),
      });
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.loggedInUser.set(null);
    this.router.navigate(['/login']);
  }

  isTokenExpired(token?: string): boolean {
    const t = token ?? localStorage.getItem(TOKEN_KEY);
    if (!t) return true;
    try {
      const { exp } = jwtDecode<{ exp: number }>(t);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
