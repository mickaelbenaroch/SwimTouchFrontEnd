import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'datepipe'})
export class CustomDatePipe implements PipeTransform {

public response : string;
  transform(date: string): string {
    if(date.length > 10 ){
        this.response = date[0] + date[1] + date[2] + date[3] + date[4] + date[5] + date[6] + date[7] + date[8] + date[9];
        return this.response;
    }else{
        return date;
    }
  }
}