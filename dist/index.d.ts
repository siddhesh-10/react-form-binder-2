import { ChangeEvent } from 'react';
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
export declare function useFormBinder<T extends object>(initialValues: T, validators?: Validators<T>): UseFormBinderReturn<T>;
export default useFormBinder;
