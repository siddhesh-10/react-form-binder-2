import { useState, useCallback, ChangeEvent } from 'react';

/**
 * A type for validator functions.
 * Given the current field value and all form values,
 * it returns an error message string if invalid, or undefined if valid.
 */
export type Validator<T> = (value: any, values: T) => string | undefined;

/**
 * A mapping of field paths (can be nested using dot-notation) to validator functions.
 */
export type Validators<T> = {
  [fieldPath: string]: Validator<T>;
};

/**
 * A type for the binding return object.
 */
export interface FieldBinding {
  value: any;
  onChange: (e: ChangeEvent<any>) => void;
  // Optionally you can add onBlur or other event handlers here.
}

/**
 * A type for the hook return value.
 */
export interface UseFormBinderReturn<T> {
  values: T;
  errors: Record<string, string | undefined>;
  bind: (fieldPath: string) => FieldBinding;
  /**
   * Validates the entire form. Returns true if all fields are valid,
   * otherwise false. It also updates the errors state.
   */
  validate: () => boolean;
}

/**
 * Utility: Retrieve a nested property value using a path array.
 */
function getIn(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
}

/**
 * Utility: Produce a new object with a nested property updated.
 *
 * @param obj - The original object.
 * @param path - An array of keys representing the nested path.
 * @param value - The new value to set at the given path.
 * @returns A new object with the nested property updated.
 */
function setIn<T>(obj: T, path: string[], value: any): T {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  // Ensure the current level is an object; if not, create one.
  const currentLevel = (obj as any)[head] ?? (tail.length ? {} : undefined);
  return {
    ...obj,
    [head]: tail.length > 0 ? setIn(currentLevel, tail, value) : value,
  };
}

/**
 * useFormBinder
 *
 * A custom hook for managing form state with support for:
 * - Automatic binding of input values (even nested, using dot-notation)
 * - Field-level validation (validators run on each change)
 * - A full-form validation function
 *
 * @param initialValues - The initial values for your form.
 * @param validators - An optional object mapping field paths to validator functions.
 *
 * @returns An object containing:
 *   - values: The current form state.
 *   - errors: The current error messages for each field (if any).
 *   - bind: A function that returns the props for an input field.
 *   - validate: A function that validates the entire form.
 *
 * @example
 * // Using the hook in a React component:
 * const initialValues = { 
 *   name: '', 
 *   email: '', 
 *   user: { age: 0 } 
 * };
 *
 * const validators = {
 *   'name': (value) => value.trim() === '' ? 'Name is required' : undefined,
 *   'email': (value) => /\S+@\S+\.\S+/.test(value) ? undefined : 'Invalid email',
 *   'user.age': (value) => value < 18 ? 'Must be 18 or older' : undefined,
 * };
 *
 * const { values, errors, bind, validate } = useFormBinder(initialValues, validators);
 */
export function useFormBinder<T extends object>(
  initialValues: T,
  validators?: Validators<T>
): UseFormBinderReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Helper to run a validator for a given field (if it exists)
  const runValidator = (fieldPath: string, fieldValue: any, allValues: T): string | undefined => {
    if (validators && validators[fieldPath]) {
      return validators[fieldPath](fieldValue, allValues);
    }
    return undefined;
  };

  // bind: returns props to bind to an input field.
  const bind = useCallback(
    (fieldPath: string): FieldBinding => {
      const path = fieldPath.split('.');
      // Retrieve current field value (using nested access)
      const fieldValue = getIn(values, path);
      return {
        value: fieldValue,
        onChange: (e: ChangeEvent<any>) => {
          const newValue =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          // Update the values state immutably using setIn helper
          setValues((prevValues) => {
            const updatedValues = setIn(prevValues, path, newValue);
            // Run validator for this field and update errors accordingly
            const errorMsg = runValidator(fieldPath, newValue, updatedValues);
            setErrors((prevErrors) => ({ ...prevErrors, [fieldPath]: errorMsg }));
            return updatedValues;
          });
        },
      };
    },
    [values, validators]
  );

  /**
   * validate: Runs all validators for the form.
   * Updates the errors state.
   * @returns true if no errors are found; false otherwise.
   */
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    if (validators) {
      for (const fieldPath in validators) {
        if (Object.prototype.hasOwnProperty.call(validators, fieldPath)) {
          const path = fieldPath.split('.');
          const fieldValue = getIn(values, path);
          const errorMsg = validators[fieldPath](fieldValue, values);
          newErrors[fieldPath] = errorMsg;
          if (errorMsg) {
            isValid = false;
          }
        }
      }
    }
    setErrors(newErrors);
    return isValid;
  }, [values, validators]);

  return { values, errors, bind, validate };
}

export default useFormBinder;
