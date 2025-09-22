import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Checks that the description contains at least 5 characters.
 */
export function descriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    return value.trim().length < 5 ? { tropCourt: true } : null;
  };
}
