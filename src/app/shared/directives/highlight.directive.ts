import { Directive, ElementRef, Renderer2, Input, inject, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {  
  @Input('appHighlight') gravite: 'leger' | 'modere' | 'grave' = 'leger';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
  let couleur = '';
  if (this.gravite === 'grave') {
    couleur = '#fecaca';
  } else if (this.gravite === 'modere') {
    couleur = '#fef08a';
  } else {
    couleur = '#bbf7d0';
  }

  this.renderer.setStyle(this.el.nativeElement, 'background-color', couleur);
}

}
