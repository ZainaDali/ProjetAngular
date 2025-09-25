import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GravitePipe } from '../../shared/pipes/gravite.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { Symptome } from './symptome.model';
@Component({
  selector: 'app-symptome-item',
  standalone: true,
  imports: [CommonModule, GravitePipe, HighlightDirective],
  template: `
    <li class="border p-3 rounded" [appHighlight]="symptome.gravite">
      <div class="text-sm text-gray-600">{{ symptome.date | date:'short' }}</div>
      <div class="font-medium">
        {{ symptome.description }} — <span>{{ symptome.gravite | graviteLabel }}</span>
      </div>
      <div *ngIf="symptome.notes?.length" class="mt-2 text-sm">
        <div class="font-semibold">Notes du médecin</div>
        <ul class="list-disc list-inside space-y-1">
          <li *ngFor="let n of symptome.notes">
            <span class="text-gray-600 text-xs">{{ n.date | date:'short' }}</span> — {{ n.contenu }}
          </li>
        </ul>
      </div>
      <div class="flex gap-3 mt-2">
        <button class="text-blue-600 hover:underline" (click)="editer.emit(symptome)">
          Modifier
        </button>
        <button class="text-red-600 hover:underline" (click)="supprimer.emit(symptome.id)">
          Supprimer
        </button>
      </div>
    </li>
  `
})
export class SymptomeItemComponent {
  @Input() symptome!: Symptome;
  @Output() supprimer = new EventEmitter<number>();
  @Output() editer = new EventEmitter<Symptome>();
}
