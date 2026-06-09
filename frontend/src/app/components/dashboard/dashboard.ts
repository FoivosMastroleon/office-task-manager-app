import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { TaskService } from '../../shared/services/task.service';
import { BoardService } from '../../shared/services/board.service';
import { UserService } from '../../shared/services/user.service';
import { WeatherService } from '../../shared/services/weather.service';
import { Task } from '../../shared/interfaces/task.interface';
import { Board } from '../../shared/interfaces/board.interface';
import { IUser } from '../../shared/interfaces/user.interface';
import { Navbar } from '../navbar/navbar';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  authService = inject(AuthService);
  private taskService = inject(TaskService);
  private boardService = inject(BoardService);
  private userService = inject(UserService);
  weatherService = inject(WeatherService);

  tasks = signal<Task[]>([]);
  boards = signal<Board[]>([]);
  users = signal<IUser[]>([]);
  editingTask = signal<Task | null>(null);
  showDone = signal(false);

  get visibleTasks() {
    if (this.showDone()) return this.tasks();
    return this.tasks().filter(t => t.status !== 'done');
  }

  editTitle = '';
  editDescription = '';
  editAssignedTo = '';
  editDueDate = '';

  get user() {
    return this.authService.loggedInUser();
  }

  get role() {
    return this.user?.role;
  }

  ngOnInit(): void {
    this.weatherService.loadWeather();

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

  openEditTask(task: Task) {
    this.editingTask.set(task);
    this.editTitle = task.title;
    this.editDescription = task.description ?? '';
    this.editAssignedTo = task.assignedTo?.id ?? '';
    this.editDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
  }

  cancelEditTask() {
    this.editingTask.set(null);
  }

  submitEditTask() {
    const task = this.editingTask();
    if (!task) return;
    this.taskService.updateTask(task.id, {
      title: this.editTitle,
      description: this.editDescription,
      assignedTo: this.editAssignedTo,
      dueDate: this.editDueDate ? new Date(this.editDueDate) : undefined
    } as any).subscribe(updated => {
      this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
      this.editingTask.set(null);
    });
  }
}
