import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timerpipe'})
export class TimerPipe implements PipeTransform {
  transform(time: string): string {
    if(time.length < 2){
        return '0'+time;
    }else if(time.length > 2){
        return time[0]+time[1];
    }else{
        return time; 
    }
  }
}