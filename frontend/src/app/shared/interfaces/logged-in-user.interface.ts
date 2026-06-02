export interface ILoggedInUser {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  firstname?: string;
}
