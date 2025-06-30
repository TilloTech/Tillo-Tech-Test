import { mount } from '@vue/test-utils';
import { describe, expect, it, beforeEach } from 'vitest';
import BaseButton from '@/components/ui/BaseButton.vue';

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Click me',
        },
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toBe('Click me');
      expect(wrapper.classes()).toContain('bg-blue-600');
      expect(wrapper.classes()).toContain('text-white');
    });

    it('renders as different HTML elements', () => {
      const wrapper = mount(BaseButton, {
        props: { tag: 'a' },
        slots: { default: 'Link' },
      });

      expect(wrapper.find('a').exists()).toBe(true);
      expect(wrapper.find('button').exists()).toBe(false);
    });

    it('renders with different variants', () => {
      const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
      
      variants.forEach(variant => {
        const wrapper = mount(BaseButton, {
          props: { variant },
          slots: { default: variant },
        });

        expect(wrapper.text()).toBe(variant);
        
        switch (variant) {
          case 'primary':
            expect(wrapper.classes()).toContain('bg-blue-600');
            break;
          case 'secondary':
            expect(wrapper.classes()).toContain('bg-gray-200');
            break;
          case 'danger':
            expect(wrapper.classes()).toContain('bg-red-600');
            break;
          case 'ghost':
            expect(wrapper.classes()).toContain('text-gray-700');
            break;
        }
      });
    });

    it('renders with different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      
      sizes.forEach(size => {
        const wrapper = mount(BaseButton, {
          props: { size },
          slots: { default: size },
        });

        expect(wrapper.text()).toBe(size);
        
        switch (size) {
          case 'sm':
            expect(wrapper.classes()).toContain('px-3');
            expect(wrapper.classes()).toContain('py-1.5');
            expect(wrapper.classes()).toContain('text-sm');
            break;
          case 'md':
            expect(wrapper.classes()).toContain('px-4');
            expect(wrapper.classes()).toContain('py-2');
            expect(wrapper.classes()).toContain('text-sm');
            break;
          case 'lg':
            expect(wrapper.classes()).toContain('px-6');
            expect(wrapper.classes()).toContain('py-3');
            expect(wrapper.classes()).toContain('text-base');
            break;
        }
      });
    });
  });

  describe('Props', () => {
    it('applies disabled state correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
      expect(wrapper.classes()).toContain('cursor-not-allowed');
      expect(wrapper.classes()).toContain('opacity-60');
    });

    it('applies loading state correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Loading' },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
      expect(wrapper.classes()).toContain('cursor-not-allowed');
      expect(wrapper.classes()).toContain('opacity-60');
      expect(wrapper.find('svg.animate-spin').exists()).toBe(true);
    });

    it('sets correct button type', () => {
      const wrapper = mount(BaseButton, {
        props: { type: 'submit' },
        slots: { default: 'Submit' },
      });

      expect(wrapper.attributes('type')).toBe('submit');
    });

    it('passes through additional attributes', () => {
      const wrapper = mount(BaseButton, {
        props: { id: 'test-button', 'data-testid': 'my-button' },
        slots: { default: 'Test' },
      });

      expect(wrapper.attributes('id')).toBe('test-button');
      expect(wrapper.attributes('data-testid')).toBe('my-button');
    });
  });

  describe('Events', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Click me' },
      });

      await wrapper.trigger('click');
      
      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')?.[0]).toBeTruthy();
    });

    it('does not emit click when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' },
      });

      await wrapper.trigger('click');
      
      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('does not emit click when loading', async () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Loading' },
      });

      await wrapper.trigger('click');
      
      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('has proper focus styles', () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Accessible' },
      });

      expect(wrapper.classes()).toContain('focus:outline-none');
      expect(wrapper.classes()).toContain('focus:ring-2');
      expect(wrapper.classes()).toContain('focus:ring-offset-2');
    });

    it('maintains focus ring color based on variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'primary' },
        slots: { default: 'Primary' },
      });

      expect(wrapper.classes()).toContain('focus:ring-blue-500');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Loading' },
      });

      const spinner = wrapper.find('svg.animate-spin');
      expect(spinner.exists()).toBe(true);
      expect(spinner.attributes('viewBox')).toBe('0 0 24 24');
    });

    it('disables button when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Loading' },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });

  describe('Combined States', () => {
    it('handles disabled and loading states together', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true, loading: true },
        slots: { default: 'Disabled Loading' },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
      expect(wrapper.classes()).toContain('cursor-not-allowed');
      expect(wrapper.classes()).toContain('opacity-60');
      expect(wrapper.find('svg.animate-spin').exists()).toBe(true);
    });

    it('applies correct classes for different variant and size combinations', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger', size: 'lg' },
        slots: { default: 'Danger Large' },
      });

      expect(wrapper.classes()).toContain('bg-red-600');
      expect(wrapper.classes()).toContain('px-6');
      expect(wrapper.classes()).toContain('py-3');
      expect(wrapper.classes()).toContain('text-base');
    });
  });
}); 