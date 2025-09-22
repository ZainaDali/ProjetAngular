import { GravitePipe } from './gravite.pipe';

describe('GravitePipe', () => {
  const pipe = new GravitePipe();

  it('transforme "leger" en "Léger"', () => {
    expect(pipe.transform('leger')).toBe('Léger');
  });

  it('transforme "modere" en "Modéré"', () => {
    expect(pipe.transform('modere')).toBe('Modéré');
  });

  it('transforme "grave" en "Grave"', () => {
    expect(pipe.transform('grave')).toBe('Grave');
  });

  it('retourne la valeur brute si inconnue', () => {
  const valeurInconnue = 'autre' as unknown as 'leger' | 'modere' | 'grave';
  expect(pipe.transform(valeurInconnue)).toBe('autre');
});

});
