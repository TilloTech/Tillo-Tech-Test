# Vue.js Component Architecture

This document outlines the component architecture and best practices for the TilloMart frontend.

## Component Structure

### UI Components (`/ui/`)
Base, reusable UI components that follow design system principles:

- `BaseButton.vue` - Reusable button component with variants
- `BaseInput.vue` - Form input component (to be created)
- `BaseModal.vue` - Modal/dialog component (to be created)
- `BaseCard.vue` - Card layout component (to be created)

### Feature Components (`/`)
Domain-specific components that combine UI components:

- `Header.vue` - Application header with navigation
- `ProductCard.vue` - Product display card
- `ProductFilters.vue` - Product filtering interface
- `Pagination.vue` - Pagination controls
- `Toast.vue` - Toast notification component
- `ToastProvider.vue` - Toast provider wrapper

## Best Practices

### 1. Component Naming
- Use PascalCase for component names
- Use descriptive, semantic names
- Prefix base components with "Base"

### 2. Props Interface
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});
```

### 3. Emits Interface
```typescript
const emit = defineEmits<{
  click: [event: MouseEvent];
  change: [value: string];
  submit: [data: FormData];
}>();
```

### 4. Computed Properties
```typescript
const buttonClasses = computed(() => {
  return [
    'base-class',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.disabled && 'disabled',
  ].filter(Boolean).join(' ');
});
```

### 5. Event Handling
```typescript
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
```

### 6. Accessibility
- Use semantic HTML elements
- Include ARIA attributes where needed
- Ensure keyboard navigation
- Provide focus management

### 7. Styling
- Use Tailwind CSS utility classes
- Follow design system tokens
- Use CSS custom properties for theming
- Ensure responsive design

### 8. TypeScript
- Define proper interfaces for all props
- Use strict typing for events
- Avoid `any` types
- Use union types for variants

## Component Examples

### Base Button Component
```vue
<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tag?: 'button' | 'a' | 'Link';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  tag: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  // Implementation
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>
```

## State Management

### Pinia Stores
Use Pinia for global state management:

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    toasts: [],
  }),
  
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  
  actions: {
    addToCart(product: Product) {
      // Implementation
    },
  },
});
```

### Composables
Use composables for reusable logic:

```typescript
// composables/useFormValidation.ts
export function useFormValidation<T>(initialData: T) {
  // Implementation
}
```

## Error Handling

### Centralized Error Handler
```typescript
// utils/errorHandler.ts
export const errorHandler = ErrorHandler.getInstance();

// Usage
try {
  await api.post('/endpoint', data);
} catch (error) {
  errorHandler.handleError(error, 'ComponentName');
}
```

## Testing

### Component Testing
```typescript
// __tests__/components/BaseButton.test.ts
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/ui/BaseButton.vue';

describe('BaseButton', () => {
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

## Performance

### Lazy Loading
```typescript
// Lazy load heavy components
const HeavyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'));
```

### Memoization
```typescript
// Use computed for expensive calculations
const expensiveValue = computed(() => {
  return heavyCalculation(props.data);
});
```

## Security

### Input Sanitization
```typescript
// Sanitize user inputs
const sanitizedInput = DOMPurify.sanitize(userInput);
```

### XSS Prevention
```vue
<!-- Use v-text instead of v-html when possible -->
<div v-text="userContent"></div>
```

## Accessibility Checklist

- [ ] Semantic HTML elements
- [ ] ARIA labels and roles
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader support
- [ ] Color contrast compliance
- [ ] Alt text for images
- [ ] Form labels and descriptions

## Performance Checklist

- [ ] Lazy load heavy components
- [ ] Use computed properties for expensive calculations
- [ ] Implement proper memoization
- [ ] Optimize bundle size
- [ ] Use proper caching strategies
- [ ] Minimize re-renders
- [ ] Implement virtual scrolling for large lists 