import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TaskService } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { BoardService } from '../../shared/services/board.service';
import { Task } from '../../shared/interfaces/task.interface';
import { IUserSummary } from '../../shared/interfaces/user.interface';
import { Board } from '../../shared/interfaces/board.interface';

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
  private boardService = inject(BoardService);
  private route = inject(ActivatedRoute);

  tasks = signal<Task[]>([]);
  allUsers = signal<IUserSummary[]>([]);
  allBoards = signal<Board[]>([]);
  activeFilter = signal<'all' | 'active' | 'done'>('all');
  showInactive = signal(false);
  editingTask = signal<Task | null>(null);
  showCreateForm = signal(false);

  editTitle = '';
  editDescription = '';
  editAssignedTo = '';
  editDueDate = '';

  newTitle = '';
  newDescription = '';
  newAssignedTo = '';
  newDueDate = '';
  newBoard = '';

  get user() { return this.authService.loggedInUser(); }
  get role() { return this.user?.role; }
  get canManage() { return this.role === 'admin' || this.role === 'manager'; }

  get filteredTasks() {
    const base = this.showInactive()
      ? this.tasks().filter(t => !t.isActive)
      : this.tasks().filter(t => t.isActive);
    const f = this.activeFilter();
    if (f === 'active') return base.filter(t => t.status !== 'done');
    if (f === 'done') return base.filter(t => t.status === 'done');
    return base;
  }

  ngOnInit(): void {
    const filter = this.route.snapshot.queryParamMap.get('filter');
    if (filter === 'done') this.activeFilter.set('done');
    if (filter === 'active') this.activeFilter.set('active');

    if (this.role === 'employee') {
      this.taskService.getTasksByAssignee(this.user!.userId).subscribe(t => this.tasks.set(t));
    } else {
      if (this.role === 'admin') {
        this.taskService.getTasksIncludingInactive().subscribe(t => this.tasks.set(t));
      } else {
        this.taskService.getTasks().subscribe(t => this.tasks.set(t));
      }
      this.userService.getUserSummaries().subscribe(u => this.allUsers.set(u));
      this.boardService.getBoards().subscribe(b => this.allBoards.set(b));
    }
  }

  setFilter(f: 'all' | 'active' | 'done') {
    this.activeFilter.set(f);
  }

  openCreateForm() {
    this.showCreateForm.set(true);
    this.newTitle = '';
    this.newDescription = '';
    this.newAssignedTo = '';
    this.newDueDate = '';
    this.newBoard = '';
  }

  cancelCreateForm() {
    this.showCreateForm.set(false);
  }

  submitCreateTask() {
    if (!this.newTitle || !this.newBoard || !this.newAssignedTo) return;
    this.taskService.createTask({
      title: this.newTitle,
      description: this.newDescription,
      board: this.newBoard,
      assignedTo: this.newAssignedTo,
      assignedBy: this.user!.userId,
      dueDate: this.newDueDate ? new Date(this.newDueDate) : undefined,
    } as any).subscribe(task => {
      this.tasks.update(ts => [...ts, task]);
      this.showCreateForm.set(false);
    });
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

  restoreTask(id: string) {
    this.taskService.restoreTask(id).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  getStatusLabel(status: string): string {
    if (status === 'working_on_it') return 'In Progress';
    if (status === 'done') return 'Done';
    return 'To Do';
  }
}
