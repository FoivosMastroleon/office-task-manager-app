import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../interfaces/task.interface';



@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = `${environment.apiURL}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getTasksByBoardId(boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/board/${boardId}`);
  }

  getTasksByAssignee(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assignee/${userId}`);
  }

  createTask(data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  updateTask(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }

    restoreTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/restore`, {});
  }

    
   updateTaskStatus(id: string, status: 'todo' | 'working_on_it' | 'done'): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status });
  }
}
