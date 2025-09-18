import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'graviteLabel',
  standalone: true,
})
export class GravitePipe implements PipeTransform {
  // Transforme la valeur interne en libellé humain
  transform(v: 'leger' | 'modere' | 'grave'): string {
    switch (v) {
      case 'leger': return 'Léger';
      case 'modere': return 'Modéré';
      case 'grave': return 'Grave';
      default: return v;
    }
  }
}
