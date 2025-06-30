<template>
    <div class="flex justify-center">
        <nav class="flex items-center space-x-2">
            <button
                :disabled="currentPage === 1"
                @click="$emit('page-change', currentPage - 1)"
                class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
            >
                Previous
            </button>

            <button
                v-for="page in visiblePages"
                :key="page"
                @click="$emit('page-change', page)"
                class="rounded-lg px-3 py-2 transition-colors duration-200"
                :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
            >
                {{ page }}
            </button>

            <button
                :disabled="currentPage === totalPages"
                @click="$emit('page-change', currentPage + 1)"
                class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
            >
                Next
            </button>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    currentPage: number;
    totalPages: number;
    maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
    maxVisiblePages: 5,
});

const visiblePages = computed(() => {
    const pages: number[] = [];
    const halfVisible = Math.floor(props.maxVisiblePages / 2);

    let start = Math.max(1, props.currentPage - halfVisible);
    let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start < props.maxVisiblePages - 1) {
        start = Math.max(1, end - props.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});

defineEmits<{
    'page-change': [page: number];
}>();
</script>
