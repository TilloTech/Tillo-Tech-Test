<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Order Confirmation" :cart-item-count="0" @cart-click="handleCartClick" />

        <main class="container mx-auto px-4 py-8">
            <div class="mx-auto max-w-4xl">
                <!-- Loading/Error State -->
                <div v-if="!order" class="py-12 text-center">
                    <p class="text-lg text-gray-500 dark:text-gray-400">Loading order details...</p>
                </div>

                <!-- Order Content -->
                <div v-else>
                    <!-- Success Message -->
                    <div class="mb-8 text-center">
                        <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
                        <p class="text-lg text-gray-600 dark:text-gray-400">
                            Thank you for your order. We'll send you an email confirmation shortly.
                        </p>
                    </div>

                    <!-- Order Details -->
                    <div class="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                        <div class="mb-6 flex items-start justify-between">
                            <div>
                                <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Order Details</h2>
                                <p class="text-gray-600 dark:text-gray-400">Order #{{ order.order_number }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                                <p class="text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</p>
                            </div>
                        </div>

                        <!-- Customer Information -->
                        <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Customer Information</h3>
                                <p class="text-gray-600 dark:text-gray-400">{{ order.shipping_name }}</p>
                                <p class="text-gray-600 dark:text-gray-400">{{ order.shipping_email }}</p>
                                <p v-if="order.shipping_phone" class="text-gray-600 dark:text-gray-400">{{ order.shipping_phone }}</p>
                            </div>
                            <div>
                                <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                                <div class="text-gray-600 dark:text-gray-400">
                                    <p>{{ order.shipping_name }}</p>
                                    <p>{{ order.shipping_address }}</p>
                                    <p v-if="order.shipping_address2">{{ order.shipping_address2 }}</p>
                                    <p>{{ order.shipping_city }}</p>
                                    <p>{{ order.shipping_country }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Order Items -->
                        <div class="border-t border-gray-200 pt-6 dark:border-gray-700">
                            <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Order Items</h3>
                            <div class="space-y-4">
                                <div v-for="item in order.items" :key="item.id" class="flex items-center space-x-4">
                                    <img
                                        :src="item.product?.image || '/placeholder-image.jpg'"
                                        :alt="item.product_name"
                                        class="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div class="flex-1">
                                        <h4 class="font-medium text-gray-900 dark:text-white">{{ item.product_name }}</h4>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-medium text-gray-900 dark:text-white">£{{ Number(item.price).toFixed(2) }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Total: £{{ Number(item.total).toFixed(2) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div class="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span class="text-gray-900 dark:text-white">£{{ Number(order.subtotal).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Tax (20%)</span>
                                    <span class="text-gray-900 dark:text-white">£{{ Number(order.tax).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span class="text-gray-900 dark:text-white">£{{ Number(order.shipping).toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-700">
                                    <span class="text-gray-900 dark:text-white">Total</span>
                                    <span class="text-gray-900 dark:text-white">£{{ Number(order.total).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div class="mb-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                        <h3 class="mb-3 font-semibold text-blue-900 dark:text-blue-100">What's Next?</h3>
                        <ul class="space-y-2 text-blue-800 dark:text-blue-200">
                            <li class="flex items-start">
                                <span class="mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                                <span>You'll receive an email confirmation with your order details</span>
                            </li>
                            <li class="flex items-start">
                                <span class="mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                                <span>We'll process your order and ship it within 2-3 business days</span>
                            </li>
                            <li class="flex items-start">
                                <span class="mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                                <span>You'll receive tracking information once your order ships</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-center">
                        <button
                            @click="handleContinueShopping"
                            class="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/product';
import { router } from '@inertiajs/vue3';
import { onMounted } from 'vue';
import Header from '../components/Header.vue';
import { useCart } from '../composables/useCart';

interface Props {
    order: Order;
}

const props = defineProps<Props>();
const { cartItems } = useCart();

// Debug logging
onMounted(() => {
    console.log('OrderConfirmation mounted');
    console.log('Props:', props);
    console.log('Order:', props.order);

    // Clear the cart after successful order (silently, no notification)
    cartItems.value = [];

    if (props.order?.items) {
        console.log('Order items:', props.order.items);
        props.order.items.forEach((item, index) => {
            console.log(`Item ${index}:`, {
                id: item.id,
                price: item.price,
                priceType: typeof item.price,
                total: item.total,
                totalType: typeof item.total,
            });
        });
    }
});

// Methods
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const handleCartClick = () => {
    router.visit('/cart');
};

const handleContinueShopping = () => {
    router.visit('/');
};
</script>
