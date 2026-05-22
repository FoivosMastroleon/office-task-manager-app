export type RoleName = 'admin' | 'manager' | 'employee';


export interface RoleDTO {
    id: string;
    role: RoleName;
    description?: string;
    active?: boolean;
}
