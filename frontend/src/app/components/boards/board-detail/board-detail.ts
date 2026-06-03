import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { BoardService } from '../../../shared/services/board.service';
import { TaskService } from '../../../shared/services/task.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Board } from '../../../shared/interfaces/board.interface';
import { IUser } from '../../../shared/interfaces/user.interface';
import { Task } from '../../../shared/interfaces/task.interface';
import { UserService } from '../../../shared/services/user.service';


@Component({
  selector: 'app-board-detail',
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss',
})
export class BoardDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  board = signal<Board | null>(null);
  tasks = signal<Task[]>([]);
  allUsers = signal<IUser[]>([]);
  showMembers = signal(false);
  selectedUserId = signal('');

  activeColumn = signal<'todo' | 'working_on_it' | 'done' | null>(null);

  newTitle = '';
  newDescription = '';
  newAssignedTo = '';
  newDueDate = '';

  get availableUsers() {
    const members = this.board()?.members.map(m => m.id) ?? [];
    return this.allUsers().filter(u => !members.includes(u.id));
  }

  get canManage() {
  const role = this.authService.loggedInUser()?.role;
  return role === 'admin' || role === 'manager';
  }
  get todoTasks() { return this.tasks().filter(t => t.status === 'todo'); }
  get inProgressTasks() { return this.tasks().filter(t => t.status === 'working_on_it'); }
  get doneTasks() { return this.tasks().filter(t => t.status === 'done'); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.boardService.getBoardById(id).subscribe(b => this.board.set(b));
    this.taskService.getTasksByBoardId(id).subscribe(t => {
    const user = this.authService.loggedInUser();
  if (user?.role === 'employee') {
    this.tasks.set(t.filter(task => task.assignedTo?.id === user.userId));
  } else {
    this.tasks.set(t);
  }
});

    this.userService.getUsers().subscribe(u => this.allUsers.set(u));

  }

  openForm(column: 'todo' | 'working_on_it' | 'done') {
    this.activeColumn.set(column);
    this.newTitle = '';
    this.newDescription = '';
    this.newAssignedTo = '';
    this.newDueDate = '';
  }

  cancelForm() {
    this.activeColumn.set(null);
  }

  submitTask(status: 'todo' | 'working_on_it' | 'done') {
    const boardId = this.route.snapshot.paramMap.get('id')!;
    const userId = this.authService.loggedInUser()!.userId;

    this.taskService.createTask({
      title: this.newTitle,
      description: this.newDescription,
      board: boardId,
      assignedTo: this.newAssignedTo,
      assignedBy: userId,
      dueDate: this.newDueDate ? new Date(this.newDueDate) : undefined,
      status
    } as any).subscribe(task => {
      this.tasks.update(tasks => [...tasks, task]);
      this.activeColumn.set(null);
    });
  }

  updateStatus(taskId: string, status: 'todo' | 'working_on_it' | 'done') {
  this.taskService.updateTaskStatus(taskId, status).subscribe(updated => {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === updated.id ? updated : t)
    );
  });
}
    addMember() {
    const boardId = this.board()!.id;
    const userId = this.selectedUserId();
    if (!userId) return;
    this.boardService.addMember(boardId, userId).subscribe(updated => {
      this.board.set(updated);
      this.selectedUserId.set('');
    });
  }

  removeMember(userId: string) {
    const boardId = this.board()!.id;
    this.boardService.removeMember(boardId, userId).subscribe(updated => {
      this.board.set(updated);
    });
  }

}
