import { ref, computed, type Ref } from 'vue';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface FormField<T = any> {
  value: T;
  rules?: ValidationRule[];
  touched: boolean;
  dirty: boolean;
}

export function useFormValidation<T extends Record<string, any>>(initialData: T) {
  const fields = ref<Record<keyof T, FormField>>({} as any);
  const errors = ref<ValidationErrors>({});
  const isSubmitting = ref(false);

  // Initialize fields
  Object.keys(initialData).forEach(key => {
    fields.value[key as keyof T] = {
      value: initialData[key as keyof T],
      rules: [],
      touched: false,
      dirty: false,
    };
  });

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  const isDirty = computed(() => {
    return Object.values(fields.value).some(field => field.dirty);
  });

  function setFieldValue<K extends keyof T>(key: K, value: T[K]) {
    const field = fields.value[key];
    field.value = value;
    field.dirty = true;
    validateField(key);
  }

  function setFieldRules<K extends keyof T>(key: K, rules: ValidationRule[]) {
    fields.value[key].rules = rules;
  }

  function touchField<K extends keyof T>(key: K) {
    fields.value[key].touched = true;
    validateField(key);
  }

  function validateField<K extends keyof T>(key: K): boolean {
    const field = fields.value[key];
    const fieldErrors: string[] = [];

    if (field.rules) {
      field.rules.forEach(rule => {
        const value = field.value;
        
        // Required validation
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          fieldErrors.push(rule.message || `${String(key)} is required`);
        }

        // Min length validation
        if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
          fieldErrors.push(rule.message || `${String(key)} must be at least ${rule.minLength} characters`);
        }

        // Max length validation
        if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
          fieldErrors.push(rule.message || `${String(key)} must be no more than ${rule.maxLength} characters`);
        }

        // Pattern validation
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          fieldErrors.push(rule.message || `${String(key)} format is invalid`);
        }

        // Custom validation
        if (rule.custom) {
          const result = rule.custom(value);
          if (result !== true) {
            fieldErrors.push(typeof result === 'string' ? result : `${String(key)} is invalid`);
          }
        }
      });
    }

    if (fieldErrors.length > 0) {
      errors.value[String(key)] = fieldErrors;
    } else {
      delete errors.value[String(key)];
    }

    return fieldErrors.length === 0;
  }

  function validateAll(): boolean {
    let isValid = true;
    
    Object.keys(fields.value).forEach(key => {
      const fieldKey = key as keyof T;
      fields.value[fieldKey].touched = true;
      if (!validateField(fieldKey)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function reset() {
    Object.keys(fields.value).forEach(key => {
      const fieldKey = key as keyof T;
      fields.value[fieldKey] = {
        value: initialData[fieldKey],
        rules: fields.value[fieldKey].rules,
        touched: false,
        dirty: false,
      };
    });
    errors.value = {};
  }

  function getFieldError<K extends keyof T>(key: K): string | undefined {
    return errors.value[String(key)]?.[0];
  }

  function hasFieldError<K extends keyof T>(key: K): boolean {
    return !!errors.value[String(key)];
  }

  return {
    fields: fields as Ref<Record<keyof T, FormField>>,
    errors,
    isSubmitting,
    isValid,
    isDirty,
    setFieldValue,
    setFieldRules,
    touchField,
    validateField,
    validateAll,
    reset,
    getFieldError,
    hasFieldError,
  };
} 