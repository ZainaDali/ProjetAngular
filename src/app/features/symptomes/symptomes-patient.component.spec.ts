import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymptomesPatientComponent } from './symptomes-patient.component';
import { SymptomesService } from './symptomes.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../core/notifications/notifications.service';
import { By } from '@angular/platform-browser';

describe('SymptomesPatientComponent (intégration)', () => {
  let fixture: ComponentFixture<SymptomesPatientComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notifSpy: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['utilisateurCourant']);
    notifSpy = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['succes', 'info']);

    // Simuler un patient connecté
    authServiceSpy.utilisateurCourant.and.returnValue({ id: 1, nom: 'Alice', email: 'a@test.com', role: 'patient' });

    TestBed.configureTestingModule({
      imports: [SymptomesPatientComponent],
      providers: [
        SymptomesService, // vrai service (il utilise un signal interne)
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationsService, useValue: notifSpy },
      ],
    });

    fixture = TestBed.createComponent(SymptomesPatientComponent);
    fixture.detectChanges();
  });

  it('ajoute et supprime un symptôme', () => {
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName=description]')).nativeElement;
    const select: HTMLSelectElement = fixture.debugElement.query(By.css('select[formControlName=gravite]')).nativeElement;
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;

    // Remplir le formulaire
    input.value = 'Mal de tête';
    input.dispatchEvent(new Event('input'));
    select.value = 'grave';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // Soumettre
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    // Vérifier que le symptôme est dans la liste
    let items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(1);
    expect(items[0].nativeElement.textContent).toContain('Mal de tête');
    expect(items[0].nativeElement.textContent).toContain('Grave');
    expect(notifSpy.succes).toHaveBeenCalledWith('Symptôme ajouté.');

    // Cliquer sur Supprimer
    const btnSuppr = items[0].query(By.css('button')).nativeElement as HTMLButtonElement;
    btnSuppr.click();
    fixture.detectChanges();

    // Vérifier que la liste est vide
    items = fixture.debugElement.queryAll(By.css('ul li'));
    expect(items.length).toBe(0);
    expect(notifSpy.info).toHaveBeenCalledWith('Symptôme supprimé.');
  });
});
