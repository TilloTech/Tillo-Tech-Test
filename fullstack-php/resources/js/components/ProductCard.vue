<template>
    <a :href="`/products/${product.id}`" class="group block h-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <div
            class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
            <!-- Product Image -->
            <div class="relative h-48 flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
                <div v-if="product.discount" class="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-sm font-medium text-white">
                    {{ product.discount }}
                </div>
                <button
                    type="button"
                    class="absolute top-2 right-2 rounded-full bg-white p-1 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    @click.stop.prevent="$emit('wishlist-toggle', product.id)"
                >
                    <svg
                        class="h-5 w-5"
                        :class="isWishlisted ? 'fill-current text-red-500' : 'text-gray-600 dark:text-gray-400'"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                    </svg>
                </button>
            </div>

            <!-- Product Info -->
            <div class="flex flex-grow flex-col p-4">
                <div class="mb-2 flex items-center justify-between">
                    <h3 class="line-clamp-2 font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
                    <span
                        class="ml-2 inline-block flex-shrink-0 rounded px-2 py-1 text-xs font-medium"
                        :class="{
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': product.category_color === 'blue',
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': product.category_color === 'green',
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': product.category_color === 'orange',
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': product.category_color === 'red',
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200':
                                !product.category_color || product.category_color === 'gray',
                        }"
                    >
                        {{ product.category?.name || 'Unknown' }}
                    </span>
                </div>
                <p class="mb-3 line-clamp-2 flex-grow text-sm text-gray-600 dark:text-gray-400">{{ product.description }}</p>

                <!-- Price -->
                <div class="mb-4 flex items-center space-x-2">
                    <span class="text-lg font-bold text-gray-900 dark:text-white">£{{ product.price }}</span>
                    <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">£{{ product.originalPrice }}</span>
                </div>

                <!-- Rating -->
                <div class="mb-4 flex items-center space-x-1">
                    <div class="flex">
                        <svg
                            v-for="star in 5"
                            :key="star"
                            class="h-4 w-4"
                            :class="star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path>
                        </svg>
                    </div>
                    <span v-if="product.reviews_count !== undefined" class="ml-1 text-xs text-gray-500">
                        ({{ product.reviews_count }} reviews, avg: {{ averageRating }})
                    </span>
                </div>

                <!-- Add to Cart Button -->
                <button
                    type="button"
                    :disabled="isAddingToCart"
                    :class="[
                        'mt-auto flex w-full items-center justify-center rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200',
                        isAddingToCart ? 'bg-gray-400' : addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700',
                    ]"
                    @click.stop.prevent="handleAddToCart"
                >
                    <svg
                        v-if="isAddingToCart"
                        class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <svg v-else-if="addedToCart" class="mr-2 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <span v-if="isAddingToCart">Adding...</span>
                    <span v-else-if="addedToCart">Added!</span>
                    <span v-else>Add to Cart</span>
                </button>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from '../types/product';

interface Props {
    product: Product;
    isWishlisted?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'add-to-cart': [productId: number];
    'wishlist-toggle': [productId: number];
}>();

const isAddingToCart = ref(false);
const addedToCart = ref(false);

const averageRating = computed(() => {
    if (!Array.isArray(props.product.reviews) || props.product.reviews.length === 0) return 0;
    const sum = props.product.reviews.reduce((acc: number, r) => acc + (r.rating || 0), 0);
    return Number((sum / props.product.reviews.length).toFixed(1));
});

const handleAddToCart = async () => {
    if (isAddingToCart.value) return;

    isAddingToCart.value = true;
    emit('add-to-cart', props.product.id);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    isAddingToCart.value = false;
    addedToCart.value = true;

    // Reset the "Added!" state after 2 seconds
    setTimeout(() => {
        addedToCart.value = false;
    }, 2000);
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
