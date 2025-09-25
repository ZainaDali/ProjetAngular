import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // reset localStorage between tests
    localStorage.clear();
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        AuthService,
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('initialise un admin par défaut si aucun utilisateur sauvegardé', () => {
    // l’admin est seedé au premier constructeur
    // puis on vérifie qu’un login avec cet admin fonctionne
    const user = service.connecter({ email: 'admin@medinotes.com', motDePasse: 'admin1234' });
    expect(user.role).toBe('medecin');
    expect(service.estConnecte()).toBeTrue();
  });

  it('inscrire crée un utilisateur et connecte', () => {
    const u = service.inscrire({
      nom: 'Pat',
      email: 'pat@test.com',
      motDePasse: '12345678',
      confirmation: '12345678',
      role: 'patient',
    });
    expect(u.email).toBe('pat@test.com');
    expect(service.estConnecte()).toBeTrue();
  });

  it('refuse inscription si email dupliqué', () => {
    service.inscrire({
      nom: 'Pat', email: 'dup@test.com', motDePasse: 'abc', confirmation: 'abc', role: 'patient',
    });
    expect(() => service.inscrire({
      nom: 'Pat2', email: 'dup@test.com', motDePasse: 'abc', confirmation: 'abc', role: 'patient',
    })).toThrowError();
  });

  it('connecter échoue avec mauvais identifiants', () => {
    expect(() => service.connecter({ email: 'x@y.z', motDePasse: 'bad' })).toThrowError();
  });

  it('deconnecter nettoie la session et redirige', () => {
    service.inscrire({
      nom: 'User', email: 'u@test.com', motDePasse: 'pass', confirmation: 'pass', role: 'patient',
    });
    expect(service.estConnecte()).toBeTrue();
    service.deconnecter();
    expect(service.estConnecte()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/connexion'], { replaceUrl: true });
  });

  it('estMedecin reflète le rôle courant', () => {
    service.inscrire({
      nom: 'Dr', email: 'd@test.com', motDePasse: 'pass', confirmation: 'pass', role: 'medecin',
    });
    expect(service.estMedecin()).toBeTrue();
  });
});


