import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valide que deux champs d'un même formulaire (par ex. motDePasse/confirmation) ont la même valeur.
 * On garde des noms français pour rester cohérents dans tout le projet.
 */
export function motDePasseIdentiqueValidator(
  champMotDePasse: string,
  champConfirmation: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const mdp = group.get(champMotDePasse)?.value;
    const conf = group.get(champConfirmation)?.value;
    if (mdp && conf && mdp !== conf) {
      group.get(champConfirmation)?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  };
}
