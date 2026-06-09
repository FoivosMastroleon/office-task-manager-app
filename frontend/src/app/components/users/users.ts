import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { IUser, IUserSummary } from '../../shared/interfaces/user.interface';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  users = signal<IUser[]>([]);
  userSummaries = signal<IUserSummary[]>([]);
  roles = signal<{ _id: string; role: string }[]>([]);
  showForm = signal(false);
  editingUser = signal<IUser | null>(null);
  activeFilter = signal<'active' | 'inactive'>('active');

  formEmail = '';
  formFirstname = '';
  formLastname = '';
  formRole = '';
  formDepartment = '';
  formPosition = '';

  editRole = '';
  editDepartment = '';
  editPosition = '';

  get filteredUsers() {
    return this.users().filter(u => this.activeFilter() === 'active' ? u.isActive : !u.isActive);
  }

  readonly departments = ['HR', 'IT', 'Sales', 'Marketing', 'Finance', 'Production'];
  readonly positions = ['HR Manager', 'Developer', 'Analyst', 'Product Manager', 'Accountant',
    'Technician', 'Sales Manager', 'Office Administrator', 'Designer', 'Project Manager', 'Intern'];

  get role() {
    return this.authService.loggedInUser()?.role;
  }

  ngOnInit(): void {
    if (this.role === 'admin') {
      this.userService.getUsers().subscribe(u => this.users.set(u));
      this.userService.getRoles().subscribe(r => this.roles.set(r));
    } else if (this.role === 'manager') {
      this.userService.getUserSummaries().subscribe(u => this.userSummaries.set(u));
    }
  }

  openCreate() {
    this.formEmail = '';
    this.formFirstname = '';
    this.formLastname = '';
    this.formRole = '';
    this.formDepartment = '';
    this.formPosition = '';
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
  }

  openEdit(user: IUser) {
    this.editingUser.set(user);
    this.editRole = user.role.id;
    this.editDepartment = user.department ?? '';
    this.editPosition = user.position ?? '';
  }

  cancelEdit() {
    this.editingUser.set(null);
  }

  submitEdit() {
    const user = this.editingUser();
    if (!user) return;
    this.userService.updateUser(user.id, {
      department: this.editDepartment as any,
      position: this.editPosition as any,
      role: this.editRole as any,
    }).subscribe(updated => {
      this.users.update(us => us.map(u => u.id === updated.id ? updated : u));
      this.editingUser.set(null);
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users.update(us => us.map(u => u.id === id ? { ...u, isActive: false } : u));
    });
  }

  restoreUser(id: string) {
    this.userService.restoreUser(id).subscribe(updated => {
      this.users.update(us => us.map(u => u.id === updated.id ? updated : u));
    });
  }

  submitForm() {
    this.userService.createUser({
      email: this.formEmail,
      firstname: this.formFirstname,
      lastname: this.formLastname,
      role: this.formRole as any,
      department: this.formDepartment as any,
      position: this.formPosition as any,
    }).subscribe(created => {
      this.users.update(u => [...u, created]);
      this.showForm.set(false);
    });
  }
}
