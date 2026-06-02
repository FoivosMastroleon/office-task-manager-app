import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { BoardService } from '../../shared/services/board.service';
import { Board } from '../../shared/interfaces/board.interface';

@Component({
  selector: 'app-boards',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './boards.html',
  styleUrl: './boards.scss',
})
export class Boards implements OnInit {
  private boardService = inject(BoardService);

  boards = signal<Board[]>([]);

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(b => this.boards.set(b));
  }
}
