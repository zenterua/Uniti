import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class OnlyNumber implements PipeTransform {

  transform(value: any, args?: any): any {
    return Object.keys(value);
  }
}