import { ExerciseModel } from './ExerciseModel';
import { TeamModel } from './TeamModel';

export class TrainningModel{
    public exercises: ExerciseModel[] = [];
    public name: string;
    public coachmail: string;
    public team_id: TeamModel;
}