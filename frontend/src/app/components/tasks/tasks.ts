import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
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
  activeFilter = signal<'all' | 'active' | 'done'>('active');
  showInactive = signal(false);
  editingTask = signal<Task | null>(null);
  showCreateForm = signal(false);
  selectedTask = signal<Task | null>(null);

  @HostListener('document:keydown.escape')
  onEsc() { this.selectedTask.set(null); }

  editTitle = '';
  editDescription = '';
  editAssignedTo = '';
  editDueDate = '';
  editStatus = '';

  newTitle = '';
  newDescription = '';
  newAssignedTo = '';
  newDueDate = '';
  newBoard = '';

  createErrors = signal<{ title?: string; description?: string; board?: string; assignedTo?: string }>({});
  editErrors = signal<{ title?: string; description?: string }>({});

  get user() { return this.authService.loggedInUser(); }
  get role() { return this.user?.role; }
  get canManage() { return this.role === 'admin' || this.role === 'manager'; }

  get boardMembersForCreate() {
    if (!this.newBoard) return [];
    const board = this.allBoards().find(b => b.id === this.newBoard);
    return board ? board.members : [];
  }

  // This getter depends on allBoards, which is only loaded for admin and managers in ngOnInit.
  // It works correctly as long as the edit form remains behind the canManage guard in the template.
  // If the guard is removed, the dropdown will appear empty without any error.
  get boardMembersForEdit() {
    const task = this.editingTask();
    if (!task?.board) return [];
    const board = this.allBoards().find(b => b.id === task.board.id);
    return board ? board.members : [];
  }

  onBoardChange() {
    this.newAssignedTo = '';
  }

  get filteredTasks() {
    if (this.showInactive()) {
      return this.tasks().filter(t => t.isActive === false);
    }
    const active = this.tasks().filter(t => t.isActive !== false);
    const f = this.activeFilter();
    if (f === 'active') return active.filter(t => t.status !== 'done');
    if (f === 'done') return active.filter(t => t.status === 'done');
    return [...active, ...this.tasks().filter(t => t.isActive === false)];
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
    this.createErrors.set({});
  }

  submitCreateTask() {
    const errors: { title?: string; description?: string; board?: string; assignedTo?: string } = {};

    if (!this.newTitle.trim()) {
      errors.title = 'Title is required';
    } else if (this.newTitle.length < 10 || this.newTitle.length > 60) {
      errors.title = 'Title must be between 10 and 60 characters';
    }

    if (this.newDescription && this.newDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!this.newBoard) {
      errors.board = 'Please select a board';
    }

    if (!this.newAssignedTo) {
      errors.assignedTo = 'Please assign to a user';
    }

    if (Object.keys(errors).length > 0) {
      this.createErrors.set(errors);
      return;
    }

    this.createErrors.set({});
    this.taskService.createTask({
      title: this.newTitle,


      // The "undefined" was added to ensure that 
      // optional fields are not sent as empty strings, 
      // which could cause issues with Zod since 
      // it rejects empty strings for optional fields.
      description: this.newDescription || undefined,
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
    this.editStatus = task.status;
  }

  cancelEditTask() {
    this.editingTask.set(null);
    this.editErrors.set({});
  }

  submitEditTask() {
    const task = this.editingTask();
    if (!task) return;

    const errors: { title?: string; description?: string } = {};

    if (!this.editTitle.trim()) {
      errors.title = 'Title is required';
    } else if (this.editTitle.length < 10 || this.editTitle.length > 60) {
      errors.title = 'Title must be between 10 and 60 characters';
    }

    if (this.editDescription && this.editDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      this.editErrors.set(errors);
      return;
    }

    this.editErrors.set({});
    this.taskService.updateTask(task.id, {
      title: this.editTitle,
      description: this.editDescription || undefined,
      assignedTo: this.editAssignedTo,
      dueDate: this.editDueDate ? new Date(this.editDueDate) : undefined,
      status: this.editStatus
    } as any).subscribe(updated => {
      this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
      this.editingTask.set(null);
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  reopenTask(id: string) {
    this.taskService.updateTaskStatus(id, 'todo').subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  startTask(id: string) {
    this.taskService.updateTaskStatus(id, 'working_on_it').subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
      if (this.selectedTask()) this.selectedTask.set(updated);
    });
  }

  markAsDone(id: string) {
    this.taskService.updateTaskStatus(id, 'done').subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
      if (this.selectedTask()) this.selectedTask.set(updated);
    });
  }

  openTaskDetail(task: Task) {
    if (this.editingTask()?.id === task.id) return;
    this.selectedTask.set(task);
  }

  closeTaskDetail() {
    this.selectedTask.set(null);
  }

  restoreTask(id: string) {
    this.taskService.restoreTask(id).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  getStatusLabel(status: string): string {
    if (status === 'working_on_it') return 'Working On It';
    if (status === 'done') return 'Done';
    return 'To Do';
  }
}
