import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subtractHours'
})
export class SubtractHoursPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return value;
    const date = new Date(value);
    date.setHours(date.getHours() - 5); 
    date.setMinutes(date.getMinutes() - 30); 
    return date;
  }
}