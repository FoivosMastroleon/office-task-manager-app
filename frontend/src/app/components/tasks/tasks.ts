import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TaskService } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { Task } from '../../shared/interfaces/task.interface';
import { IUser } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  tasks = signal<Task[]>([]);
  allUsers = signal<IUser[]>([]);
  activeFilter = signal<'all' | 'active' | 'done'>('all');
  editingTask = signal<Task | null>(null);

  editTitle = '';
  editDescription = '';
  editAssignedTo = '';
  editDueDate = '';

  get user() { return this.authService.loggedInUser(); }
  get role() { return this.user?.role; }
  get canManage() { return this.role === 'admin' || this.role === 'manager'; }

  get filteredTasks() {
    const f = this.activeFilter();
    if (f === 'active') return this.tasks().filter(t => t.status !== 'done');
    if (f === 'done') return this.tasks().filter(t => t.status === 'done');
    return this.tasks();
  }

  ngOnInit(): void {
    const filter = this.route.snapshot.queryParamMap.get('filter');
    if (filter === 'done') this.activeFilter.set('done');

    if (this.role === 'employee') {
      this.taskService.getTasksByAssignee(this.user!.userId).subscribe(t => this.tasks.set(t));
    } else {
      this.taskService.getTasks().subscribe(t => this.tasks.set(t));
      this.userService.getUsers().subscribe(u => this.allUsers.set(u));
    }
  }

  setFilter(f: 'all' | 'active' | 'done') {
    this.activeFilter.set(f);
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

  getStatusLabel(status: string): string {
    if (status === 'working_on_it') return 'In Progress';
    if (status === 'done') return 'Done';
    return 'To Do';
  }
}
