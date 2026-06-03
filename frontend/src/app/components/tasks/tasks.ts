import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { TaskService } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { Task } from '../../shared/interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  tasks = signal<Task[]>([]);
  activeFilter = signal<'all' | 'active' | 'done'>('all');

  get user() { return this.authService.loggedInUser(); }
  get role() { return this.user?.role; }

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
    }
  }

  setFilter(f: 'all' | 'active' | 'done') {
    this.activeFilter.set(f);
  }

  getStatusLabel(status: string): string {
    if (status === 'working_on_it') return 'In Progress';
    if (status === 'done') return 'Done';
    return 'To Do';
  }
}
