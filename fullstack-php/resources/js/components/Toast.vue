<template>
    <div class="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform">
        <TransitionGroup name="banner" tag="div" class="space-y-2">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="max-w-md min-w-80 transform rounded-lg px-4 py-3 shadow-lg transition-all duration-300"
                :class="toastClasses[toast.type]"
            >
                <div class="flex items-center justify-between">
                    <!-- Icon and Message -->
                    <div class="flex items-center">
                        <div class="mr-3 flex-shrink-0">
                            <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <svg v-else-if="toast.type === 'error'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>

                        <!-- Message -->
                        <div class="flex-1">
                            <p class="text-sm font-medium">{{ toast.message }}</p>
                        </div>
                    </div>

                    <!-- Close button -->
                    <button @click="removeToast(toast.id)" class="ml-3 flex-shrink-0 text-current opacity-70 transition-opacity hover:opacity-100">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import type { Toast } from '../composables/useCart';

interface Props {
    toasts: Toast[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'remove-toast': [id: number];
}>();

const toastClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
};

const removeToast = (id: number) => {
    emit('remove-toast', id);
};
</script>

<style scoped>
.banner-enter-active,
.banner-leave-active {
    transition: all 0.4s ease;
}

.banner-enter-from {
    opacity: 0;
    transform: translateY(-100%);
}

.banner-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

.banner-move {
    transition: transform 0.4s ease;
}
</style>
