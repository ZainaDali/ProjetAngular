import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Checks that the password and confirmation fields are identical
 */
export function motDePasseValidator(mdpCtrl: string, confirmCtrl: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const motDePasse = formGroup.get(mdpCtrl)?.value;
    const confirmation = formGroup.get(confirmCtrl)?.value;

    if (!motDePasse || !confirmation) return null;
    return motDePasse === confirmation ? null : { motDePasseMismatch: true };
  };
}
