import { SwimmingStylesEnum } from '../enums/swimmingstylesenum';

export class TeamTargetModel{

    public date: Date;
    
    //Style of specific swimming
    public style: SwimmingStylesEnum;

    //Distance of a specific style of swimming
    public distance: number;

    //Target of the swimmer in a specific style of swimming
    public targetTime: number;

    //In how much tries the swimmer has to improve its record
    public triesToImprove: number;

    //Swimmer ID for reference
    public team_id: string;

    //Selected Card
    public selected: boolean;

    //Is the target done
    public done: boolean = false;

    //notification_has_been_send
    public notification_has_been_send: boolean = false;

    //ID
    public _id: string;

    //Constructor
    public TeamTargetModel(){};

}