import { SwimmingStylesEnum } from '../enums/swimmingstylesenum';
import { NumberValueAccessor } from '@angular/forms/src/directives';

export class SwimmerTargetModel{

    //Style of specific swimming
    public Style: SwimmingStylesEnum;

    //Distance of a specific style of swimming
    public Distance: number;

    //Target of the swimmer in a specific style of swimming
    public Target: number;

    //In how much tries the swimmer has to improve its record
    public TriesToImprove: number;

}