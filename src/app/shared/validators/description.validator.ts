import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Vérifie que la description contient au moins 5 caractères.
 */
export function descriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return value.trim().length < 5 ? { tropCourt: true } : null;
  };
}
