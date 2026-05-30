import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';

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

  createUser(data: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, data);
  }

  updateUser(id: string, data: Partial<IUser>): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<IUser> {
    return this.http.delete<IUser>(`${this.apiUrl}/${id}`);
  }
}
