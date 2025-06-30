<template>
    <div class="mb-8">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <select
                        v-model.number="selectedCategory"
                        @change="$emit('category-change', selectedCategory)"
                        class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option :value="''">All Categories</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <svg
                        class="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div class="relative">
                    <select
                        v-model="selectedSort"
                        @change="$emit('sort-change', selectedSort)"
                        class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">
                            {{ sort.label }}
                        </option>
                    </select>
                    <svg
                        class="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            <div class="relative">
                <textarea
                    :value="searchQuery"
                    @input="handleSearchInput"
                    placeholder="Search products..."
                    autocomplete="off"
                    spellcheck="false"
                    autocorrect="off"
                    autocapitalize="off"
                    data-lpignore="true"
                    style="text-transform: none; white-space: pre; resize: none; overflow: hidden;"
                    rows="1"
                    class="w-64 rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <svg class="absolute top-2.5 left-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface SortOption {
    value: string;
    label: string;
}

interface InitialFilters {
    search?: string;
    category?: number;
    sort?: string;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    initialFilters?: InitialFilters;
}

const props = withDefaults(defineProps<Props>(), {
    initialFilters: () => ({}),
});

const searchQuery = ref(props.initialFilters.search || '');
const selectedCategory = ref(props.initialFilters.category || '');
const selectedSort = ref(props.initialFilters.sort || 'featured');

const sortOptions: SortOption[] = [
    { value: 'featured', label: 'Sort by: Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
];

// Watch for prop changes to update local state
watch(
    () => props.initialFilters,
    (newFilters) => {
        searchQuery.value = newFilters.search || '';
        selectedCategory.value = newFilters.category || '';
        selectedSort.value = newFilters.sort || 'featured';
    },
    { deep: true },
);

const emit = defineEmits<{
    'search-change': [query: string];
    'category-change': [category: number | string];
    'sort-change': [sort: string];
}>();

const handleSearchInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
        const value = target.value;
        console.log('Raw input value:', JSON.stringify(value));
        console.log('Value length:', value.length);
        console.log('Contains spaces:', value.includes(' '));
        
        // Auto-resize the textarea
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
        
        // Manually update the searchQuery ref
        searchQuery.value = value;
        
        // Emit the value
        emit('search-change', value);
    }
};
</script>
