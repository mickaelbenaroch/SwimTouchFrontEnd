import { RouteModel } from './RouteModel';

export class OneRouteFinalResultModel{
    
    public _id: string;

    public exercise_id: string;

    public date: Date;

    public jump_time: number;

    public results: number[] = [];

    public swimmer: RouteModel;
}