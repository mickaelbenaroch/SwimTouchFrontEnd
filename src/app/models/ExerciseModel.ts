import { PoolModel } from './PoolModel';

export class ExerciseModel{

    public date: Date;

    public coach: string;

    public style: string;

    public distance: string;

    public group: string;

    public id: string;

    public howMuchTouches: number = 0;

    public routes: PoolModel = new PoolModel();

    public hasBeenStarted: boolean = false;
}