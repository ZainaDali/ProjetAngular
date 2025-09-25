import { TestBed } from '@angular/core/testing';
import { SymptomesService } from './symptomes.service';
import { PatientNotificationsService } from '../../core/services/patient-notifications.service';

describe('SymptomesService', () => {
  let service: SymptomesService;
  let notifSpy: jasmine.SpyObj<PatientNotificationsService>;

  beforeEach(() => {
    localStorage.clear();
    notifSpy = jasmine.createSpyObj<PatientNotificationsService>('PatientNotificationsService', ['push']);
    TestBed.configureTestingModule({
      providers: [
        { provide: PatientNotificationsService, useValue: notifSpy },
        SymptomesService,
      ],
    });
    service = TestBed.inject(SymptomesService);
  });

  function creerSymptome(id: number, patientId = 1) {
    return { id, patientId, description: 'desc ' + id, gravite: 'leger', date: new Date().toISOString() } as any;
  }

  it('ajouter persiste et liste', () => {
    service.ajouter(creerSymptome(1));
    expect(service.symptomes().length).toBe(1);
    expect(JSON.parse(localStorage.getItem('medinotes.symptomes') || '[]').length).toBe(1);
  });

  it('modifier met à jour un symptôme existant', () => {
    service.ajouter(creerSymptome(1));
    service.modifier(1, { description: 'maj', gravite: 'modere' });
    const s = service.symptomes()[0];
    expect(s.description).toBe('maj');
    expect(s.gravite).toBe('modere');
  });

  it('supprimer retire un symptôme', () => {
    service.ajouter(creerSymptome(1));
    service.supprimer(1);
    expect(service.symptomes().length).toBe(0);
  });

  it('ajouterNote crée et notifie', () => {
    service.ajouter(creerSymptome(2));
    const note = service.ajouterNote(2, { auteur: 'Dr', contenu: 'Obs' });
    expect(note).not.toBeNull();
    expect(service.symptomes()[0].notes?.length).toBe(1);
    expect(notifSpy.push).toHaveBeenCalled();
  });

  it('modifierNote modifie une note existante', () => {
    service.ajouter(creerSymptome(3));
    const note = service.ajouterNote(3, { auteur: 'Dr', contenu: 'A' })!;
    const ok = service.modifierNote(3, note.id, 'B');
    expect(ok).toBeTrue();
    expect(service.symptomes()[0].notes?.[0].contenu).toBe('B');
  });

  it('supprimerNote supprime une note', () => {
    service.ajouter(creerSymptome(4));
    const note = service.ajouterNote(4, { auteur: 'Dr', contenu: 'X' })!;
    const ok = service.supprimerNote(4, note.id);
    expect(ok).toBeTrue();
    expect(service.symptomes()[0].notes?.length).toBe(0);
  });

  it('getByPatient filtre par patient', () => {
    service.ajouter(creerSymptome(10, 1));
    service.ajouter(creerSymptome(11, 2));
    const res = service.getByPatient(2);
    expect(res.length).toBe(1);
    expect(res[0].patientId).toBe(2);
  });
});


