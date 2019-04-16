import { SwimmingStylesEnum } from '../enums/swimmingstylesenum';

export class SwimmerTargetModel{

    //Style of specific swimming
    public Style: SwimmingStylesEnum;

    //Distance of a specific style of swimming
    public Distance: number;

    //Target of the swimmer in a specific style of swimming
    public TargetTime: number;

    //In how much tries the swimmer has to improve its record
    public TriesToImprove: number;

    //Swimmer ID for reference
    public Swimmer_ref: string;

    //Constructor
    public SwimmerTargetModel(){};

}