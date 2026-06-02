import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { BoardService } from '../../../shared/services/board.service';
import { TaskService } from '../../../shared/services/task.service';
import { Board } from '../../../shared/interfaces/board.interface';
import { Task } from '../../../shared/interfaces/task.interface';

@Component({
  selector: 'app-board-detail',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss',
})
export class BoardDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);

  board = signal<Board | null>(null);
  tasks = signal<Task[]>([]);

  get todoTasks() {
    return this.tasks().filter(t => t.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks().filter(t => t.status === 'working_on_it');
  }

  get doneTasks() {
    return this.tasks().filter(t => t.status === 'done');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.boardService.getBoardById(id).subscribe(b => this.board.set(b));
    this.taskService.getTasksByBoardId(id).subscribe(t => this.tasks.set(t));
  }
}
