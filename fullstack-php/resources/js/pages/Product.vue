<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Product Catalogue" :cart-item-count="cartItemCount" @cart-click="handleCartClick" />
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col gap-8 md:flex-row">
                <!-- Product Image -->
                <div class="flex w-full flex-shrink-0 items-center justify-center md:w-1/2">
                    <img
                        :src="product.image"
                        :alt="product.name"
                        class="max-h-96 w-full rounded-lg bg-white object-contain p-4 shadow-lg dark:bg-gray-800"
                    />
                </div>
                <!-- Product Info -->
                <div class="flex-1">
                    <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{{ product.name }}</h1>
                    <div class="mb-2 flex items-center space-x-2">
                        <span class="text-lg font-bold text-gray-900 dark:text-white">£{{ product.price }}</span>
                        <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">£{{ product.originalPrice }}</span>
                        <span v-if="product.discount" class="ml-2 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">{{
                            product.discount
                        }}</span>
                    </div>
                    <div class="mb-4 flex items-center space-x-1">
                        <div class="flex">
                            <svg
                                v-for="star in 5"
                                :key="star"
                                class="h-5 w-5"
                                :class="star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                ></path>
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400"> ({{ reviewsArray.length }} reviews, avg: {{ averageRating }}) </span>
                    </div>
                    <p class="mb-6 text-gray-700 dark:text-gray-300">{{ product.description }}</p>
                    <div class="mb-4">
                        <span
                            class="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >{{ product.category?.name }}</span
                        >
                    </div>
                    <button
                        class="flex w-full items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 md:w-auto"
                        :disabled="isAddingToCart"
                        @click="handleAddToCart"
                    >
                        <svg
                            v-if="isAddingToCart"
                            class="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
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
                        <span v-if="isAddingToCart">Adding to Cart...</span>
                        <span v-else-if="addedToCart">Added to Cart!</span>
                        <span v-else>Add to Cart</span>
                    </button>
                </div>
            </div>
            <div class="mt-8">
                <a href="/" class="text-blue-600 hover:underline">&larr; Back to Catalogue</a>
            </div>
            <!-- Reviews Section -->
            <div class="mt-12">
                <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
                <div v-if="reviewsArray.length > 0" class="space-y-4">
                    <div v-for="review in reviewsArray" :key="review.id" class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div class="mb-1 font-semibold text-gray-800 dark:text-gray-200">{{ review.author }}</div>
                        <div class="text-gray-700 dark:text-gray-300">{{ review.content }}</div>
                    </div>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">No reviews yet.</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/product';
import { computed, ref } from 'vue';
import Header from '../components/Header.vue';
import { useCart } from '../composables/useCart';

interface Category {
    id: number;
    name: string;
}

interface Review {
    id: number;
    author: string;
    content: string;
    rating: number;
}

interface Props {
    product: Product;
}

const props = defineProps<Props>();
const cartItemCount = ref(0);
const isAddingToCart = ref(false);
const addedToCart = ref(false);
const { addToCart } = useCart();

const handleCartClick = () => {
    // In a real app, you'd navigate to cart page or open cart modal
};

const handleAddToCart = async () => {
    if (isAddingToCart.value) return;

    isAddingToCart.value = true;
    addToCart(props.product);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    isAddingToCart.value = false;
    addedToCart.value = true;

    // Reset the "Added to Cart!" state after 2 seconds
    setTimeout(() => {
        addedToCart.value = false;
    }, 2000);
};

const isReview = (item: unknown): item is { id: number; rating: number; author: string; content: string } => {
    return typeof item === 'object' && item !== null && 'id' in item && 'rating' in item && 'author' in item && 'content' in item;
};

const reviewsArray = computed(() => {
    if (!Array.isArray(props.product.reviews)) return [];
    return props.product.reviews.filter(isReview);
});

const averageRating = computed(() => {
    if (!reviewsArray.value.length) return 0;
    const sum = reviewsArray.value.reduce((acc: number, r) => acc + (r.rating || 0), 0);
    return Number((sum / reviewsArray.value.length).toFixed(1));
});
</script>
