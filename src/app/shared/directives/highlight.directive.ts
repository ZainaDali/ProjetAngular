import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

/**
 * Met en évidence un élément selon la gravité du symptôme.
 * NB: On utilise des styles inline pour éviter les soucis de purge Tailwind côté TS.
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input() appHighlight: 'leger' | 'modere' | 'grave' | undefined;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnChanges(): void {
    const style = this.getStyle(this.appHighlight);
    this.rd.setStyle(this.el.nativeElement, 'backgroundColor', style.bg);
    this.rd.setStyle(this.el.nativeElement, 'borderLeft', `4px solid ${style.border}`);
  }

  private getStyle(g?: 'leger' | 'modere' | 'grave') {
    switch (g) {
      case 'leger':  return { bg: '#F0FDF4', border: '#16A34A' }; // vert très pâle
      case 'modere': return { bg: '#FFFBEB', border: '#F59E0B' }; // jaune pâle
      case 'grave':  return { bg: '#FEF2F2', border: '#DC2626' }; // rouge pâle
      default:       return { bg: 'white',   border: '#E5E7EB' };
    }
  }
}
