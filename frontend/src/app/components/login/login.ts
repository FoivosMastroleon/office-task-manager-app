import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {
  constructor(private authService: AuthService) {}

  onDemoLogin(role: 'admin' | 'manager' | 'employee') {
    this.authService.demoLogin(role);
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.authService.googleLogin(response.credential)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large', shape: 'rectangular', width: 300 }
    );
  }
}
