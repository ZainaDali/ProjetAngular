import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['estConnecte']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/cible' } as RouterStateSnapshot;
  });

  it('autorise si connecté', () => {
    authServiceSpy.estConnecte.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    expect(result).toBeTrue();
  });

  it('redirige vers /auth/connexion si non connecté avec returnUrl', () => {
    authServiceSpy.estConnecte.and.returnValue(false);
    const tree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(tree);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    expect(result).toBe(tree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/connexion'], { queryParams: { returnUrl: '/cible' } });
  });
});


