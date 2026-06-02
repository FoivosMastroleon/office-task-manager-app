import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { TaskService } from '../../shared/services/task.service';
import { BoardService } from '../../shared/services/board.service';
import { UserService } from '../../shared/services/user.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { IUser } from '../../shared/interfaces/user.interface';
import { Navbar } from '../navbar/navbar';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  authService = inject(AuthService);
  private taskService = inject(TaskService);
  private boardService = inject(BoardService);
  private userService = inject(UserService);

  tasks = signal<Task[]>([]);
  boards = signal<Board[]>([]);
  users = signal<IUser[]>([]);

  get user() {
    return this.authService.loggedInUser();
  }

  get role() {
    return this.user?.role;
  }

  ngOnInit(): void {
    if (this.role === 'admin') {
      this.userService.getUsers().subscribe(u => this.users.set(u));
      this.boardService.getBoards().subscribe(b => this.boards.set(b));
      this.taskService.getTasks().subscribe(t => this.tasks.set(t));
    } else if (this.role === 'manager') {
      this.boardService.getBoards().subscribe(b => this.boards.set(b));
      this.taskService.getTasks().subscribe(t => this.tasks.set(t));
    } else if (this.role === 'employee' && this.user) {
      this.taskService.getTasksByAssignee(this.user.userId).subscribe(t => this.tasks.set(t));
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getTaskCount(status: string): number {
    return this.tasks().filter(t => t.status === status).length;
  }
}
