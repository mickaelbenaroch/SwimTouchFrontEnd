import { RoleEnum } from '../enums/roleenum';

export class ProfileModel{
    
    public _id: string;

    public user: string;

    public first_name: string;

    public last_name: string;

    public age: number;

    public group: string;

    public type: RoleEnum;

    public picture: string;
}