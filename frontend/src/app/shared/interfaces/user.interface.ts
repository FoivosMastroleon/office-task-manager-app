export interface IRole {
  id: string;
  role: 'admin' | 'manager' | 'employee';
  description?: string;
}

export interface IUser {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  googleId?: string;
  department?: string;
  position?: string;
  role: IRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSummary {
  id: string;
  firstname?: string;
  lastname?: string;
  department?: string;
  position?: string;
}