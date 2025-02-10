"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormBinder = useFormBinder;
var react_1 = require("react");
/**
 * Utility: Retrieve a nested property value using a path array.
 */
function getIn(obj, path) {
    return path.reduce(function (acc, key) { return (acc && typeof acc === 'object' ? acc[key] : undefined); }, obj);
}
/**
 * Utility: Produce a new object with a nested property updated.
 *
 * @param obj - The original object.
 * @param path - An array of keys representing the nested path.
 * @param value - The new value to set at the given path.
 * @returns A new object with the nested property updated.
 */
function setIn(obj, path, value) {
    var _a;
    var _b;
    if (path.length === 0)
        return obj;
    var head = path[0], tail = path.slice(1);
    // Ensure the current level is an object; if not, create one.
    var currentLevel = (_b = obj[head]) !== null && _b !== void 0 ? _b : (tail.length ? {} : undefined);
    return __assign(__assign({}, obj), (_a = {}, _a[head] = tail.length > 0 ? setIn(currentLevel, tail, value) : value, _a));
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
function useFormBinder(initialValues, validators) {
    var _a = (0, react_1.useState)(initialValues), values = _a[0], setValues = _a[1];
    var _b = (0, react_1.useState)({}), errors = _b[0], setErrors = _b[1];
    // Helper to run a validator for a given field (if it exists)
    var runValidator = function (fieldPath, fieldValue, allValues) {
        if (validators && validators[fieldPath]) {
            return validators[fieldPath](fieldValue, allValues);
        }
        return undefined;
    };
    // bind: returns props to bind to an input field.
    var bind = (0, react_1.useCallback)(function (fieldPath) {
        var path = fieldPath.split('.');
        // Retrieve current field value (using nested access)
        var fieldValue = getIn(values, path);
        return {
            value: fieldValue,
            onChange: function (e) {
                var newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                // Update the values state immutably using setIn helper
                setValues(function (prevValues) {
                    var updatedValues = setIn(prevValues, path, newValue);
                    // Run validator for this field and update errors accordingly
                    var errorMsg = runValidator(fieldPath, newValue, updatedValues);
                    setErrors(function (prevErrors) {
                        var _a;
                        return (__assign(__assign({}, prevErrors), (_a = {}, _a[fieldPath] = errorMsg, _a)));
                    });
                    return updatedValues;
                });
            },
        };
    }, [values, validators]);
    /**
     * validate: Runs all validators for the form.
     * Updates the errors state.
     * @returns true if no errors are found; false otherwise.
     */
    var validate = (0, react_1.useCallback)(function () {
        var newErrors = {};
        var isValid = true;
        if (validators) {
            for (var fieldPath in validators) {
                if (Object.prototype.hasOwnProperty.call(validators, fieldPath)) {
                    var path = fieldPath.split('.');
                    var fieldValue = getIn(values, path);
                    var errorMsg = validators[fieldPath](fieldValue, values);
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
    return { values: values, errors: errors, bind: bind, validate: validate };
}
exports.default = useFormBinder;
