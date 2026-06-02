import { Component, inject, OnInit } from '@angular/core';
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

  boards: Board[] = [];


  ngOnInit(): void {
  this.boardService.getBoards().subscribe({
    next: b => {
      console.log('boards:', b);
      this.boards = b;
    },
    error: err => console.error('boards error:', err)
  });
}
}
