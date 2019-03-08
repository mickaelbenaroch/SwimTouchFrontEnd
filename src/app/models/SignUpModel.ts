import { RoleEnum } from '../enums/roleenum';

export class SignUpModel{
    public user: string;

    public pwd: string;

    public first_name: string;

    public last_name: string;

    public age: number;

    public group: string;

    public type: RoleEnum = RoleEnum.Swimmer;
}