import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'utilisateurCourant',
    ]);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    // Create fake route and state (even if not used in your guard)
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test' } as RouterStateSnapshot;
  });

  it('autorise si utilisateur est médecin', () => {
    authServiceSpy.utilisateurCourant.and.returnValue({
      id: 1,
      nom: 'Doc',
      email: 'doc@test.com',
      role: 'medecin',
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState),
    );

    expect(result).toBeTrue();
  });

  it('redirige si pas médecin', () => {
    authServiceSpy.utilisateurCourant.and.returnValue({
      id: 2,
      nom: 'Pat',
      email: 'pat@test.com',
      role: 'patient',
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/accueil']);
  });
});
