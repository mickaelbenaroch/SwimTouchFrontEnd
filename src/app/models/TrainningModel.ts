import { ExerciseModel } from './ExerciseModel';
import { TeamModel } from './TeamModel';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

export class TrainningModel{
    public exercises: ExerciseModel[] = [];
    public name: string;
    public coachmail: string;
    public team_id: TeamModel;
    public date: string;
    public exercisesCount = this.exercises.length;
    public distance: number;
} 