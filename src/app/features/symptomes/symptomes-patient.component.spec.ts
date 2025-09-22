import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SymptomesPatientComponent } from './symptomes-patient.component';
import { SymptomesService } from './symptomes.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';

describe('SymptomesPatientComponent (Integration)', () => {
  let fixture: ComponentFixture<SymptomesPatientComponent>;
  let component: SymptomesPatientComponent;
  let symptomesService: SymptomesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomesPatientComponent, ReactiveFormsModule],
      providers: [SymptomesService, AuthService, NotificationsService],
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomesPatientComponent);
    component = fixture.componentInstance;
    symptomesService = TestBed.inject(SymptomesService);

    // Clean data
    symptomesService.symptomes.set([]);

    // Simulate connected user
    spyOn(component.auth, 'utilisateurCourant').and.returnValue({
      id: 1,
      nom: 'Patient Test',
      email: 'test@test.com',
      role: 'patient',
    });

    fixture.detectChanges();
  });

  it('affiche une erreur si description est vide', () => {
    component.form.controls['description'].setValue('');
    component.form.controls['description'].markAsTouched();
    fixture.detectChanges();

    const erreur = fixture.debugElement.query(By.css('.text-red-600'));
    expect(erreur.nativeElement.textContent).toContain('La description est obligatoire.');
  });

  it('ajoute un symptôme et l’affiche dans la liste', () => {
    component.form.setValue({ description: 'Mal de tête', gravite: 'leger' });
    component.soumettre();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(1);
    expect(items[0].nativeElement.textContent).toContain('Mal de tête');
  });

  it('supprime un symptôme via la méthode supprimer()', () => {
    // Add a symptom
    component.form.setValue({ description: 'Douleur au dos', gravite: 'modere' });
    component.soumettre();
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(1);

    // Delete directly via component method
    const symptome = symptomesService.symptomes()[0];
    component.supprimer(symptome.id);
    fixture.detectChanges();

    items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(0);
  });

  it('modifie un symptôme existant via editer() + soumettre()', () => {
    // Add a symptom
    component.form.setValue({ description: 'Fièvre légère', gravite: 'leger' });
    component.soumettre();
    fixture.detectChanges();

    let items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items[0].nativeElement.textContent).toContain('Fièvre légère');

    // Switch to edit mode
    const symptome = symptomesService.symptomes()[0];
    component.editer(symptome);

    // Modifier le formulaire
    component.form.setValue({ description: 'Fièvre modérée', gravite: 'modere' });
    component.soumettre();
    fixture.detectChanges();

    items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items[0].nativeElement.textContent).toContain('Fièvre modérée');
  });
});
