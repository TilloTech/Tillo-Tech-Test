<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Your Basket" />
        <div class="container mx-auto px-4 py-8">
            <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
            <div v-if="cartItems.length === 0" class="py-12 text-center text-lg text-gray-500 dark:text-gray-400">Your basket is empty.</div>
            <div v-else class="space-y-6">
                <div
                    v-for="item in cartItems"
                    :key="item.product.id"
                    class="flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow md:flex-row dark:bg-gray-800"
                >
                    <img :src="item.product.image" :alt="item.product.name" class="h-24 w-24 rounded object-cover" />
                    <div class="w-full flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ item.product.name }}</h3>
                        <div class="mb-2 text-gray-600 dark:text-gray-400">£{{ item.product.price }}</div>
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-700 dark:text-gray-300">Qty:</label>
                            <input
                                type="number"
                                min="1"
                                class="w-16 rounded border border-gray-300 px-2 py-1 dark:border-gray-600"
                                v-model.number="item.quantity"
                                @change="updateQuantity(item.product.id, item.quantity)"
                            />
                            <button class="ml-4 text-sm text-red-600 hover:underline" @click="removeFromCart(item.product.id)">Remove</button>
                        </div>
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">£{{ (item.product.price * item.quantity).toFixed(2) }}</div>
                </div>

                <!-- Cart Summary - Improved mobile layout -->
                <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div class="text-xl font-bold text-gray-900 dark:text-white">Total: £{{ totalPrice }}</div>
                        <div class="flex flex-col gap-3 sm:flex-row">
                            <button
                                @click="handleClearCart"
                                class="w-full rounded-lg bg-gray-500 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-600 sm:w-auto"
                            >
                                Clear Cart
                            </button>
                            <button
                                @click="handleCheckout"
                                class="w-full rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8">
                <a href="/" class="text-blue-600 hover:underline">&larr; Continue Shopping</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
import { router } from '@inertiajs/vue3';
import { computed } from 'vue';
import Header from '../components/Header.vue';

const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);
});

const handleCheckout = () => {
    router.visit('/checkout');
};

const handleClearCart = () => {
    clearCart();
};
</script>
