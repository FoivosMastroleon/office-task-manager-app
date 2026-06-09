import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { BoardService } from '../../shared/services/board.service';
import { AuthService } from '../../shared/services/auth.service';
import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-boards',
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './boards.html',
  styleUrl: './boards.scss',
})
export class Boards implements OnInit {
  private boardService = inject(BoardService);
  private authService = inject(AuthService);

  boards = signal<Board[]>([]);
  showForm = signal(false);
  editingBoard = signal<Board | null>(null);
  activeFilter = signal<'active' | 'inactive'>('active');
  boardErrors = signal<{ title?: string; description?: string }>({});

  formTitle = '';
  formDescription = '';

  get filteredBoards() {
    return this.boards().filter(b => this.activeFilter() === 'active' ? b.isActive : !b.isActive);
  }

  get canManage() {
    const role = this.authService.loggedInUser()?.role;
    return role === 'admin' || role === 'manager';
  }

  ngOnInit(): void {
    const role = this.authService.loggedInUser()?.role;
    if (role === 'admin') {
      this.boardService.getBoardsIncludingInactive().subscribe(b => this.boards.set(b));
    } else {
      this.boardService.getBoards().subscribe(b => this.boards.set(b));
    }
  }

  openCreate() {
    this.formTitle = '';
    this.formDescription = '';
    this.editingBoard.set(null);
    this.showForm.set(true);
  }

  openEdit(board: Board) {
    this.formTitle = board.title;
    this.formDescription = board.description ?? '';
    this.editingBoard.set(board);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.boardErrors.set({});
  }

  submitForm() {
    const errors: { title?: string; description?: string } = {};

    if (!this.formTitle.trim()) {
      errors.title = 'Title is required';
    } else if (this.formTitle.length < 8 || this.formTitle.length > 50) {
      errors.title = 'Title must be between 8 and 50 characters';
    }

    if (this.formDescription && this.formDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      this.boardErrors.set(errors);
      return;
    }

    this.boardErrors.set({});

    const payload = { title: this.formTitle, description: this.formDescription };
    const editing = this.editingBoard();

    if (editing) {
      this.boardService.updateBoard(editing.id, payload).subscribe(updated => {
        this.boards.update(bs => bs.map(b => b.id === updated.id ? updated : b));
        this.showForm.set(false);
      });
    } else {
      this.boardService.createBoard(payload).subscribe(created => {
        this.boards.update(bs => [...bs, created]);
        this.showForm.set(false);
      });
    }
  }

  deleteBoard(id: string) {
    this.boardService.deleteBoard(id).subscribe(() => {
      this.boards.update(bs => bs.map(b => b.id === id ? { ...b, isActive: false } : b));
    });
  }

  restoreBoard(id: string) {
    this.boardService.restoreBoard(id).subscribe(updated => {
      this.boards.update(bs => bs.map(b => b.id === updated.id ? updated : b));
    });
  }
}
