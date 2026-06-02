import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { IUser, IUserSummary } from '../../shared/interfaces/user.interface';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  users = signal<IUser[]>([]);
  userSummaries = signal<IUserSummary[]>([]);

  get role() {
    return this.authService.loggedInUser()?.role;
  }

  ngOnInit(): void {
    if (this.role === 'admin') {
      this.userService.getUsers().subscribe(u => this.users.set(u));
    } else if (this.role === 'manager') {
      this.userService.getUserSummaries().subscribe(u => this.userSummaries.set(u));
    }
  }
}
