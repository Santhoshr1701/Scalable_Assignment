import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, format: string = 'inr'): string {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    if (isNaN(num)) return '';

    if (format === 'raw') {
      return num.toFixed(2);
    }

    if (format === 'number') {
      return num.toLocaleString('en-IN');
    }

    // default: format as Indian Rupee
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
    } catch (e) {
      return num.toFixed(2);
    }
  }
}
