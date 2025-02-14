# react-form-binder

A React hook for form state management with Angular-like two-way binding, nested state support, and validation — all with TypeScript support.

## Features

- **Automatic Input Binding:** Easily bind input elements to form state.
- **Nested State Support:** Use dot-notation (e.g., `user.name`) to manage nested state.
- **Field-Level & Full-Form Validation:** Supply custom validator functions for individual fields and validate the entire form.
- **TypeScript Support:** Benefit from strong typings and enhanced IDE experience.

## Installation

Using npm:

```bash
npm install react-form-binder
```

Using yarn:

```bash
yarn add react-form-binder
```

## Usage

### TypeScript Example

```tsx
import React from 'react';
import { useFormBinder } from '@yourusername/react-form-binder';

interface FormValues {
  name: string;
  email: string;
  user: {
    age: number;
  };
}

const initialValues: FormValues = {
  name: '',
  email: '',
  user: { age: 0 },
};

const validators = {
  name: (value: string) => (value.trim() === '' ? 'Name is required' : undefined),
  email: (value: string) => (/\S+@\S+\.\S+/.test(value) ? undefined : 'Invalid email address'),
  'user.age': (value: number) => (value < 18 ? 'Age must be at least 18' : undefined),
};

const MyForm: React.FC = () => {
  const { values, errors, bind, validate } = useFormBinder<FormValues>(initialValues, validators);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', values);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" {...bind('name')} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" {...bind('email')} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <div>
        <label>Age:</label>
        <input type="number" {...bind('user.age')} />
        {errors['user.age'] && <span style={{ color: 'red' }}>{errors['user.age']}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

### JavaScript Example

```jsx
import React from 'react';
import { useFormBinder } from '@yourusername/react-form-binder';

const MyForm = () => {
  const initialValues = { name: '', email: '', user: { age: 0 } };

  const validators = {
    name: (value) => (value.trim() === '' ? 'Name is required' : undefined),
    email: (value) => (/\S+@\S+\.\S+/.test(value) ? undefined : 'Invalid email address'),
    'user.age': (value) => (value < 18 ? 'Age must be at least 18' : undefined),
  };

  const { values, errors, bind, validate } = useFormBinder(initialValues, validators);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', values);
    } else {
      console.log('Validation errors:', errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" {...bind('name')} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" {...bind('email')} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <div>
        <label>Age:</label>
        <input type="number" {...bind('user.age')} />
        {errors['user.age'] && <span style={{ color: 'red' }}>{errors['user.age']}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the [MIT License](LICENSE).

