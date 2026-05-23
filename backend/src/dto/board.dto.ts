import { UserResponseDTO } from "./user.dto";

export interface CreateBoardDTO {  //The owner, comes from the Jwt- thats why not included.
    title: string;
    description?: string;
    members?: string[];  //Here we will see the ID of users in the format of an array of strings


    
}

export interface UpdateBoardDTO {
    title?: string;
    description?: string;
    members?: string[];

}

export interface BoardResponseDTO {
    id: string;
    title: string;
    description?: string;
    owner: UserResponseDTO; 
    members: UserResponseDTO[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    

}