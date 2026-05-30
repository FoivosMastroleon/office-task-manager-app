import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Boards } from './components/boards/boards';
import { BoardDetail } from './components/boards/board-detail/board-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'users', component: Users },
  { path: 'boards', component: Boards },
  { path: 'boards/:id', component: BoardDetail },
  { path: '**', redirectTo: 'login' }
];
