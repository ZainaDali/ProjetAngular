import { RolePipe } from './role.pipe';

describe('RolePipe', () => {
  const pipe = new RolePipe();

  it('retourne libellé patient', () => {
    expect(pipe.transform('patient')).toBe('👤 Patient');
  });

  it('retourne libellé médecin', () => {
    expect(pipe.transform('medecin')).toBe('🩺 Médecin');
  });

  it('retourne Utilisateur par défaut', () => {
    expect(pipe.transform('autre')).toBe('Utilisateur');
  });
});


