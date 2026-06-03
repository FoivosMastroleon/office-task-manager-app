import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Boards } from './components/boards/boards';
import { BoardDetail } from './components/boards/board-detail/board-detail';
import { authGuard } from './shared/guards/auth.guard';
import { adminManagerGuard } from './shared/guards/role.guard';
import { Tasks } from './components/tasks/tasks';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard, adminManagerGuard] },
  { path: 'boards', component: Boards, canActivate: [authGuard] },
  { path: 'boards/:id', component: BoardDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

