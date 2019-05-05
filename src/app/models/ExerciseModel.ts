import { PoolModel } from './PoolModel';
import { ExerciseTypeEnum } from '../enums/exercisetypeenum';

export class ExerciseModel{

    public date: Date;

    public coach: string;

    public style: string;

    public distance: number;

    public group: string;

    public id: string;

    public howMuchTouches: number = 0;

    public routes: PoolModel = new PoolModel();

    public hasBeenStarted: boolean = false;

    public description: string;

    public type: ExerciseTypeEnum;

    public repeat: number;

    public singleSwimDistance: number;

    public ExerciseModel(){}
}