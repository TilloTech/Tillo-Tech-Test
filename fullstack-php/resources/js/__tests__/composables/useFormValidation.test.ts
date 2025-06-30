import { describe, expect, it, beforeEach } from 'vitest';
import { useFormValidation } from '@/composables/useFormValidation';

describe('useFormValidation', () => {
  const initialData = {
    name: '',
    email: '',
    password: '',
    age: 0,
  };

  describe('Initialization', () => {
    it('should initialize with provided data', () => {
      const form = useFormValidation(initialData);

      expect(form.fields.value.name.value).toBe('');
      expect(form.fields.value.email.value).toBe('');
      expect(form.fields.value.password.value).toBe('');
      expect(form.fields.value.age.value).toBe(0);
    });

    it('should initialize with empty errors', () => {
      const form = useFormValidation(initialData);

      expect(form.errors.value).toEqual({});
    });

    it('should initialize with correct field states', () => {
      const form = useFormValidation(initialData);

      Object.values(form.fields.value).forEach(field => {
        expect(field.touched).toBe(false);
        expect(field.dirty).toBe(false);
        expect(field.rules).toEqual([]);
      });
    });

    it('should be valid initially', () => {
      const form = useFormValidation(initialData);

      expect(form.isValid.value).toBe(true);
    });

    it('should not be dirty initially', () => {
      const form = useFormValidation(initialData);

      expect(form.isDirty.value).toBe(false);
    });
  });

  describe('Field Value Management', () => {
    it('should set field value', () => {
      const form = useFormValidation(initialData);

      form.setFieldValue('name', 'John Doe');

      expect(form.fields.value.name.value).toBe('John Doe');
      expect(form.fields.value.name.dirty).toBe(true);
    });

    it('should set field rules', () => {
      const form = useFormValidation(initialData);
      const rules = [{ required: true, message: 'Name is required' }];

      form.setFieldRules('name', rules);

      expect(form.fields.value.name.rules).toEqual(rules);
    });

    it('should touch field', () => {
      const form = useFormValidation(initialData);

      form.touchField('name');

      expect(form.fields.value.name.touched).toBe(true);
    });
  });

  describe('Validation Rules', () => {
    describe('Required Validation', () => {
      it('should validate required field', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ required: true }]);

        const isValid = form.validateField('name');

        expect(isValid).toBe(false);
        expect(form.getFieldError('name')).toBe('name is required');
      });

      it('should pass required validation when field has value', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ required: true }]);
        form.setFieldValue('name', 'John Doe');

        const isValid = form.validateField('name');

        expect(isValid).toBe(true);
        expect(form.getFieldError('name')).toBeUndefined();
      });

      it('should fail required validation for whitespace-only strings', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ required: true }]);
        form.setFieldValue('name', '   ');

        const isValid = form.validateField('name');

        expect(isValid).toBe(false);
        expect(form.getFieldError('name')).toBe('name is required');
      });

      it('should use custom message for required validation', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ 
          required: true, 
          message: 'Please enter your name' 
        }]);

        form.validateField('name');

        expect(form.getFieldError('name')).toBe('Please enter your name');
      });
    });

    describe('Length Validation', () => {
      it('should validate minimum length', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('password', [{ minLength: 8 }]);
        form.setFieldValue('password', '123');

        const isValid = form.validateField('password');

        expect(isValid).toBe(false);
        expect(form.getFieldError('password')).toBe('password must be at least 8 characters');
      });

      it('should validate maximum length', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ maxLength: 10 }]);
        form.setFieldValue('name', 'Very Long Name That Exceeds Limit');

        const isValid = form.validateField('name');

        expect(isValid).toBe(false);
        expect(form.getFieldError('name')).toBe('name must be no more than 10 characters');
      });

      it('should pass length validation when within limits', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('name', [{ minLength: 2, maxLength: 10 }]);
        form.setFieldValue('name', 'John');

        const isValid = form.validateField('name');

        expect(isValid).toBe(true);
        expect(form.getFieldError('name')).toBeUndefined();
      });
    });

    describe('Pattern Validation', () => {
      it('should validate email pattern', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('email', [{ 
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email format'
        }]);
        form.setFieldValue('email', 'invalid-email');

        const isValid = form.validateField('email');

        expect(isValid).toBe(false);
        expect(form.getFieldError('email')).toBe('Invalid email format');
      });

      it('should pass pattern validation for valid email', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('email', [{ 
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Invalid email format'
        }]);
        form.setFieldValue('email', 'test@example.com');

        const isValid = form.validateField('email');

        expect(isValid).toBe(true);
        expect(form.getFieldError('email')).toBeUndefined();
      });
    });

    describe('Custom Validation', () => {
      it('should validate custom rule that returns true', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('age', [{ 
          custom: (value) => value >= 18 
        }]);
        form.setFieldValue('age', 20);

        const isValid = form.validateField('age');

        expect(isValid).toBe(true);
        expect(form.getFieldError('age')).toBeUndefined();
      });

      it('should validate custom rule that returns false', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('age', [{ 
          custom: (value) => value >= 18 
        }]);
        form.setFieldValue('age', 16);

        const isValid = form.validateField('age');

        expect(isValid).toBe(false);
        expect(form.getFieldError('age')).toBe('age is invalid');
      });

      it('should validate custom rule that returns error message', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('age', [{ 
          custom: (value) => value >= 18 || 'Must be 18 or older' 
        }]);
        form.setFieldValue('age', 16);

        const isValid = form.validateField('age');

        expect(isValid).toBe(false);
        expect(form.getFieldError('age')).toBe('Must be 18 or older');
      });
    });

    describe('Multiple Rules', () => {
      it('should validate multiple rules on same field', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('password', [
          { required: true },
          { minLength: 8 },
          { pattern: /[A-Z]/, message: 'Must contain uppercase letter' }
        ]);
        form.setFieldValue('password', 'weak');

        const isValid = form.validateField('password');

        expect(isValid).toBe(false);
        // Should show first error (minLength in this case)
        expect(form.getFieldError('password')).toBe('password must be at least 8 characters');
      });

      it('should pass when all rules are satisfied', () => {
        const form = useFormValidation(initialData);
        form.setFieldRules('password', [
          { required: true },
          { minLength: 8 },
          { pattern: /[A-Z]/, message: 'Must contain uppercase letter' }
        ]);
        form.setFieldValue('password', 'StrongPass123');

        const isValid = form.validateField('password');

        expect(isValid).toBe(true);
        expect(form.getFieldError('password')).toBeUndefined();
      });
    });
  });

  describe('Form-Level Validation', () => {
    it('should validate all fields', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);
      form.setFieldRules('email', [{ required: true }]);

      const isValid = form.validateAll();

      expect(isValid).toBe(false);
      expect(form.errors.value.name).toBeDefined();
      expect(form.errors.value.email).toBeDefined();
    });

    it('should touch all fields when validating all', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);

      form.validateAll();

      expect(form.fields.value.name.touched).toBe(true);
    });

    it('should return true when all fields are valid', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);
      form.setFieldValue('name', 'John Doe');

      const isValid = form.validateAll();

      expect(isValid).toBe(true);
      expect(Object.keys(form.errors.value)).toHaveLength(0);
    });
  });

  describe('Error Management', () => {
    it('should get field error', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);
      form.validateField('name');

      const error = form.getFieldError('name');

      expect(error).toBe('name is required');
    });

    it('should check if field has error', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);
      form.validateField('name');

      expect(form.hasFieldError('name')).toBe(true);
      expect(form.hasFieldError('email')).toBe(false);
    });

    it('should clear errors when field becomes valid', () => {
      const form = useFormValidation(initialData);
      form.setFieldRules('name', [{ required: true }]);
      form.validateField('name');

      expect(form.hasFieldError('name')).toBe(true);

      form.setFieldValue('name', 'John Doe');
      form.validateField('name');

      expect(form.hasFieldError('name')).toBe(false);
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      const form = useFormValidation(initialData);
      form.setFieldValue('name', 'John Doe');
      form.setFieldValue('email', 'john@example.com');
      form.touchField('name');
      form.setFieldRules('name', [{ required: true }]);
      form.validateField('name');

      form.reset();

      expect(form.fields.value.name.value).toBe('');
      expect(form.fields.value.email.value).toBe('');
      expect(form.fields.value.name.touched).toBe(false);
      expect(form.fields.value.name.dirty).toBe(false);
      expect(form.errors.value).toEqual({});
      expect(form.isValid.value).toBe(true);
      expect(form.isDirty.value).toBe(false);
    });

    it('should preserve field rules after reset', () => {
      const form = useFormValidation(initialData);
      const rules = [{ required: true }];
      form.setFieldRules('name', rules);

      form.reset();

      expect(form.fields.value.name.rules).toEqual(rules);
    });
  });

  describe('Dirty State Management', () => {
    it('should track dirty state when field values change', () => {
      const form = useFormValidation(initialData);

      expect(form.isDirty.value).toBe(false);

      form.setFieldValue('name', 'John Doe');

      expect(form.isDirty.value).toBe(true);
    });

    it('should reset dirty state when form is reset', () => {
      const form = useFormValidation(initialData);
      form.setFieldValue('name', 'John Doe');

      expect(form.isDirty.value).toBe(true);

      form.reset();

      expect(form.isDirty.value).toBe(false);
    });
  });

  describe('TypeScript Support', () => {
    it('should work with typed form data', () => {
      interface UserForm {
        name: string;
        email: string;
        age: number;
      }

      const userData: UserForm = {
        name: '',
        email: '',
        age: 0,
      };

      const form = useFormValidation<UserForm>(userData);

      // Should have proper typing
      form.setFieldValue('name', 'John');
      form.setFieldValue('age', 25);

      expect(form.fields.value.name.value).toBe('John');
      expect(form.fields.value.age.value).toBe(25);
    });
  });
}); 