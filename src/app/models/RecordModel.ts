import { RouteResultModel } from './RouteResultModel';

export class RecordModel{

    public exercise_id: string;

    public start_time: Date;

    public training_id: number;

    public route: RouteResultModel[]=[];

    public style: string;

    public date: Date;

    public RecordModel(){};
}