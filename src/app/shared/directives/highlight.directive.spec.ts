import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: `<p [appHighlight]="gravite">Texte test</p>`,
  standalone: true,
  imports: [HighlightDirective]
})
class TestHostComponent {
  gravite: 'leger' | 'modere' | 'grave' = 'leger';
}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('applique un style pour la gravité légère', () => {
    const p: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(p.style.backgroundColor).toBe('rgb(240, 253, 244)'); // vert pâle
  });
});
