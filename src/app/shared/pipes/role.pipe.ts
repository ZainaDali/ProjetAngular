import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleLabel',
  standalone: true 
})
export class RolePipe implements PipeTransform {
  transform(role: 'patient' | 'medecin' | string): string {
    switch (role) {
      case 'patient': return '👤 Patient';
      case 'medecin': return '🩺 Médecin';
      default: return 'Utilisateur';
    }
  }
}
