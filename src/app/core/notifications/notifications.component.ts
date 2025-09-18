import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div *ngFor="let n of notif.liste()"
           class="min-w-[260px] px-4 py-3 rounded shadow text-sm flex justify-between items-start"
           [ngClass]="classe(n.type)">
        <span class="pr-3">{{ n.message }}</span>
        <button class="opacity-70 hover:opacity-100" (click)="notif.remove(n.id)">✕</button>
      </div>
    </div>
  `,
})
export class NotificationsComponent {
  notif = inject(NotificationsService);
  classe(type: 'info'|'succes'|'erreur') {
    return {
      'bg-blue-50 text-blue-700 border border-blue-200': type === 'info',
      'bg-green-50 text-green-700 border border-green-200': type === 'succes',
      'bg-red-50 text-red-700 border border-red-200': type === 'erreur',
    };
  }
}
