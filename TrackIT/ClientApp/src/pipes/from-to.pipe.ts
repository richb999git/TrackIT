import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromTo'
})
export class FromToPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
      return value ? "\u21E6" : "\u21E8"; // true <- , false ->
  }

}
