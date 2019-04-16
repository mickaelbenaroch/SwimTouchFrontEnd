import { SwimmingStylesEnum } from '../enums/swimmingstylesenum';

export class SwimmerTargetModel{

    //Style of specific swimming
    public style: SwimmingStylesEnum;

    //Distance of a specific style of swimming
    public distance: number;

    //Target of the swimmer in a specific style of swimming
    public targetTime: number;

    //In how much tries the swimmer has to improve its record
    public triesToImprove: number;

    //Swimmer ID for reference
    public swimmer_ref: string;

    //Constructor
    public SwimmerTargetModel(){};

}