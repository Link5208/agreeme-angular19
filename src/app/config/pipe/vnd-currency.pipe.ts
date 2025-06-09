import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
})
export class VndCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0 VND';
    }

    // Multiply by 1000 and format with Vietnamese locale
    const amount = value.toLocaleString('vi-VN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    return `${amount} VND`;
  }
}
