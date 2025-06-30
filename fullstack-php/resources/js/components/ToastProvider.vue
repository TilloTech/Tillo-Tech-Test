<template>
    <div>
        <slot />
        <Toast :toasts="toasts" @remove-toast="removeToast" />
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useCart } from '../composables/useCart';
import Toast from './Toast.vue';

const { toasts, removeToast } = useCart();

// Provide toast functions to child components
provide('showToast', (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    toasts.value.push(toast);

    setTimeout(() => {
        removeToast(id);
    }, duration);
});
</script>
