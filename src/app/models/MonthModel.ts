import { MonthEnum } from '../enums/MonthEnum';
import { DayModel } from './DayModel';

export class MonthModel{

    public name: string;

    public number: MonthEnum;

    public DayArray: DayModel[] = [];

    public lenght: number;

    public MonthModel(){}
}