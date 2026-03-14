// Input validation utilities

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePositive = (value: number, fieldName: string): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  if (value <= 0) {
    return { isValid: false, error: `${fieldName} must be greater than 0` };
  }
  return { isValid: true };
};

export const validateNonNegative = (value: number, fieldName: string): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  if (value < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative` };
  }
  return { isValid: true };
};

export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult => {
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { isValid: true };
};

export const validateHypotenuse = (
  hypotenuse: number,
  side: number,
  sideName: string
): ValidationResult => {
  if (hypotenuse <= side) {
    return { isValid: false, error: `Hypotenuse must be greater than ${sideName}` };
  }
  return { isValid: true };
};

export const validateDiameters = (d1: number, d2: number): ValidationResult => {
  if (d1 <= d2) {
    return { isValid: false, error: 'Large diameter (D1) must be greater than small diameter (D2)' };
  }
  return { isValid: true };
};
