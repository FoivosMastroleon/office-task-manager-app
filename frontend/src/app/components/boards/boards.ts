import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../shared/services/auth.service';
import { BoardService } from '../../shared/services/board.service';
import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-boards',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './boards.html',
  styleUrl: './boards.scss',
})
export class Boards implements OnInit {
  private authService = inject(AuthService);
  private boardService = inject(BoardService);

  boards: Board[] = [];

  get role() {
    return this.authService.loggedInUser()?.role;
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(b => this.boards = b);
  }
}
