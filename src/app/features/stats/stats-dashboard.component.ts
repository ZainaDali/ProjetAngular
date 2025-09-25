import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymptomesService } from '../symptomes/symptomes.service';
import { AuthService } from '../auth/auth.service';
import { GravitePipe } from '../../shared/pipes/gravite.pipe';

type JourData = { dateKey: string; date: Date; leger: number; modere: number; grave: number };

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Statistiques — dernière semaine</h2>

      <!-- Cartes résumé -->
      <div class="grid grid-cols-3 gap-4 mb-6 text-center">
        <div class="p-4 border rounded bg-green-50 border-green-200">
          <div class="text-sm">Légers</div>
          <div class="text-3xl font-bold">{{ resume().leger }}</div>
        </div>
        <div class="p-4 border rounded bg-yellow-50 border-yellow-200">
          <div class="text-sm">Modérés</div>
          <div class="text-3xl font-bold">{{ resume().modere }}</div>
        </div>
        <div class="p-4 border rounded bg-red-50 border-red-200">
          <div class="text-sm">Graves</div>
          <div class="text-3xl font-bold">{{ resume().grave }}</div>
        </div>
      </div>

      <!-- Graphe d'évolution (barres empilées) -->
      <div>
        <div class="text-sm mb-2">Évolution sur 7 jours (empilé)</div>
        <svg [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight" class="w-full h-48 border rounded">
          <ng-container *ngFor="let d of parJour(); let i = index">
            <ng-container [ngTemplateOutlet]="barTemplate" [ngTemplateOutletContext]="{ $implicit: d, i: i, M: safeMax() }"></ng-container>
          </ng-container>
          <!-- Légende couleurs -->
          <g>
            <rect x="10" y="10" width="10" height="10" fill="#86efac"></rect>
            <text x="25" y="19" font-size="10">Léger</text>
            <rect x="80" y="10" width="10" height="10" fill="#fde68a"></rect>
            <text x="95" y="19" font-size="10">Modéré</text>
            <rect x="165" y="10" width="10" height="10" fill="#fca5a5"></rect>
            <text x="180" y="19" font-size="10">Grave</text>
          </g>
        </svg>
        <ng-template #barTemplate let-d let-i="i" let-M="M">
          <ng-container>
            <ng-container>
              <!-- dimensions -->
              <ng-container>
                <svg:g>
                  <svg:title>{{ d.date | date:'EEE dd/MM' }}</svg:title>
                  <!-- largeurs/positions -->
                  <ng-container>
                    <svg:rect [attr.x]="padding + i * (barWidth + gap)" [attr.y]="yPos(d, 'leger', M)" [attr.width]="barWidth" [attr.height]="h(d.leger, M)" fill="#86efac"></svg:rect>
                    <svg:rect [attr.x]="padding + i * (barWidth + gap)" [attr.y]="yPos(d, 'modere', M)" [attr.width]="barWidth" [attr.height]="h(d.modere, M)" fill="#fde68a"></svg:rect>
                    <svg:rect [attr.x]="padding + i * (barWidth + gap)" [attr.y]="yPos(d, 'grave', M)" [attr.width]="barWidth" [attr.height]="h(d.grave, M)" fill="#fca5a5"></svg:rect>
                  </ng-container>
                </svg:g>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-template>
      </div>
    </div>
  `
})
export class StatsDashboardComponent {
  private symptomes = inject(SymptomesService);
  private auth = inject(AuthService);

  // SVG layout
  svgWidth = 600;
  svgHeight = 180;
  padding = 20;
  barWidth = 50;
  gap = 20;

  // Filtre: si médecin → global; sinon uniquement ses symptômes
  sources = computed(() => {
    const all = this.symptomes.symptomes();
    if (this.auth.utilisateurCourant()?.role === 'medecin') return all;
    const id = this.auth.utilisateurCourant()?.id;
    return all.filter(s => s.patientId === id);
  });

  // 7 derniers jours (inclus aujourd'hui)
  parJour = computed<ReadonlyArray<JourData>>(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const days: JourData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = this.dateKeyLocal(d);
      days.push({ dateKey: key, date: d, leger: 0, modere: 0, grave: 0 });
    }

    const byDay = new Map<string, JourData>(days.map(dd => [dd.dateKey, dd]));
    for (const s of this.sources()) {
      const k = this.dateKeyLocal(new Date(s.date));
      const bucket = byDay.get(k);
      if (bucket) {
        bucket[s.gravite]++;
      }
    }
    return days;
  });

  resume = computed(() => {
    const base = { leger: 0, modere: 0, grave: 0 } as const;
    const acc: { leger: number; modere: number; grave: number } = { leger: 0, modere: 0, grave: 0 };
    for (const d of this.parJour()) {
      acc.leger += d.leger;
      acc.modere += d.modere;
      acc.grave += d.grave;
    }
    return { ...base, ...acc };
  });

  maxJour = computed(() => {
    let m = 0;
    for (const d of this.parJour()) {
      m = Math.max(m, d.leger + d.modere + d.grave);
    }
    return m;
  });

  // Helpers pour SVG
  private innerHeight(): number {
    return this.svgHeight - this.padding * 2 - 20; // marge pour la légende
  }

  h(value: number, M: number): number { // hauteur d'un segment
    if (M === 0) return 0;
    return (value / M) * this.innerHeight();
  }

  yPos(d: JourData, part: 'leger' | 'modere' | 'grave', M: number): number {
    const baseY = this.svgHeight - this.padding; // bas du graphe
    const hLeger = this.h(d.leger, M);
    const hModere = this.h(d.modere, M);
    const hGrave = this.h(d.grave, M);
    switch (part) {
      case 'leger': return baseY - hLeger - hModere - hGrave;
      case 'modere': return baseY - hModere - hGrave;
      case 'grave': return baseY - hGrave;
    }
  }

  safeMax(): number {
    const m = this.maxJour();
    return m > 0 ? m : 1;
  }

  private dateKeyLocal(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}


