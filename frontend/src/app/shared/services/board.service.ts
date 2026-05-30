import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Board } from '../interfaces/board.interface';



@Injectable({ providedIn: 'root' })
export class BoardService {
  private apiUrl = `${environment.apiURL}/boards`;

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  createBoard(data: Partial<Board>): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, data);
  }

  updateBoard(id: string, data: Partial<Board>): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/${id}`, data);
  }

  deleteBoard(id: string): Observable<Board> {
    return this.http.delete<Board>(`${this.apiUrl}/${id}`);
  }

    restoreBoard(id: string): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${id}/restore`, {});
  }

    addMember(boardId: string, userId: string): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${boardId}/add-member/${userId}`, {});
  }

    removeMember(boardId: string, userId: string): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/${boardId}/remove-member/${userId}`, {});
  }

}
