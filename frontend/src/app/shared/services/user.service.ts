import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser, IUserSummary } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiURL}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  getUserSummaries(): Observable<IUserSummary[]> {
    return this.http.get<IUserSummary[]>(`${this.apiUrl}/summary`);
  }

  createUser(data: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, data);
  }

  updateUser(id: string, data: Partial<IUser>): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<IUser> {
    return this.http.delete<IUser>(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<{ _id: string; role: string }[]> {
    return this.http.get<{ _id: string; role: string }[]>(`${environment.apiURL}/roles`);
  }

  restoreUser(id: string): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}/restore`, {});
  }
}
