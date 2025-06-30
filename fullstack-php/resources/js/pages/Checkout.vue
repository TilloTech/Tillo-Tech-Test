<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Checkout" :cart-item-count="cartItemCount" @cart-click="handleCartClick" />

        <main class="container mx-auto px-4 py-8">
            <div class="mx-auto max-w-4xl">
                <h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>

                <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <!-- Checkout Form -->
                    <div class="lg:col-span-2">
                        <!-- Error Messages -->
                        <div v-if="$page.props.errors && Object.keys($page.props.errors).length > 0" class="mb-6">
                            <div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-red-800 dark:text-red-200">There were errors with your submission:</h3>
                                        <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                                            <ul class="list-disc space-y-1 pl-5">
                                                <li v-for="(error, field) in $page.props.errors" :key="field">
                                                    {{ error }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Processing Indicator -->
                        <div v-if="isSubmitting" class="mb-6">
                            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg
                                            class="h-5 w-5 animate-spin text-blue-400"
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
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Processing your order...</h3>
                                        <p class="text-sm text-blue-700 dark:text-blue-300">
                                            Please wait while we process your payment and create your order.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <!-- Shipping Information -->
                            <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
                                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label for="shipping_name" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name *
                                        </label>
                                        <input
                                            id="shipping_name"
                                            v-model="form.shipping_name"
                                            type="text"
                                            required
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label for="shipping_email" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address *
                                        </label>
                                        <input
                                            id="shipping_email"
                                            v-model="form.shipping_email"
                                            type="email"
                                            required
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label for="shipping_phone" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <input
                                            id="shipping_phone"
                                            v-model="form.shipping_phone"
                                            type="tel"
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Shipping Address -->
                            <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
                                <div class="space-y-4">
                                    <div>
                                        <label for="shipping_address" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Address *
                                        </label>
                                        <input
                                            id="shipping_address"
                                            v-model="form.shipping_address"
                                            type="text"
                                            required
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div>
                                        <label for="shipping_address2" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Address Line 2
                                        </label>
                                        <input
                                            id="shipping_address2"
                                            v-model="form.shipping_address2"
                                            type="text"
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            placeholder="Apartment, suite, etc. (optional)"
                                        />
                                    </div>
                                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <label for="shipping_city" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                City *
                                            </label>
                                            <input
                                                id="shipping_city"
                                                v-model="form.shipping_city"
                                                type="text"
                                                required
                                                class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label for="shipping_postcode" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Postcode *
                                            </label>
                                            <input
                                                id="shipping_postcode"
                                                v-model="form.shipping_postcode"
                                                type="text"
                                                required
                                                class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                placeholder="Postcode"
                                            />
                                        </div>
                                        <div>
                                            <label for="shipping_country" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Country *
                                            </label>
                                            <input
                                                id="shipping_country"
                                                v-model="form.shipping_country"
                                                type="text"
                                                required
                                                class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Information -->
                            <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                                <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Payment Information</h2>
                                <div class="space-y-4">
                                    <div>
                                        <label for="card_number" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Card Number *
                                        </label>
                                        <input
                                            id="card_number"
                                            v-model="form.card_number"
                                            type="text"
                                            required
                                            placeholder="1234 5678 9012 3456"
                                            class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            @input="formatCardNumber"
                                        />
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label for="expiry_date" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Expiry Date *
                                            </label>
                                            <input
                                                id="expiry_date"
                                                v-model="form.expiry_date"
                                                type="text"
                                                required
                                                placeholder="MM/YY"
                                                class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                @input="formatExpiryDate"
                                            />
                                        </div>
                                        <div>
                                            <label for="cvv" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"> CVV * </label>
                                            <input
                                                id="cvv"
                                                v-model="form.cvv"
                                                type="text"
                                                required
                                                placeholder="123"
                                                maxlength="4"
                                                class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-end">
                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    class="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    <span v-if="isSubmitting">Processing...</span>
                                    <span v-else>Complete Order - £{{ total.toFixed(2) }}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Order Summary -->
                    <div class="lg:col-span-1">
                        <div class="sticky top-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>

                            <!-- Cart Items -->
                            <div class="mb-6 space-y-3">
                                <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                                    </div>
                                    <p class="font-medium text-gray-900 dark:text-white">£{{ (item.price * item.quantity).toFixed(2) }}</p>
                                </div>
                            </div>

                            <!-- Totals -->
                            <div class="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span class="text-gray-900 dark:text-white">£{{ subtotal.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Tax (20%)</span>
                                    <span class="text-gray-900 dark:text-white">£{{ tax.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span class="text-gray-900 dark:text-white">£{{ shipping.toFixed(2) }}</span>
                                </div>
                                <div class="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-700">
                                    <span class="text-gray-900 dark:text-white">Total</span>
                                    <span class="text-gray-900 dark:text-white">£{{ total.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';
import Header from '../components/Header.vue';
import { useCart } from '../composables/useCart';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

// State
const cartItemCount = ref(0);
const isSubmitting = ref(false);
const { getItems, clearCart } = useCart();

const form = ref({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_address2: '',
    shipping_city: '',
    shipping_postcode: '',
    shipping_country: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
});

const cartItems = ref<CartItem[]>([]);

// Computed
const subtotal = computed(() => {
    return cartItems.value.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
});

const tax = computed(() => subtotal.value * 0.2);
const shipping = computed(() => 5.99);
const total = computed(() => subtotal.value + tax.value + shipping.value);

// Methods
const formatCardNumber = () => {
    let value = form.value.card_number.replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    form.value.card_number = value.substring(0, 19);
};

const formatExpiryDate = () => {
    let value = form.value.expiry_date.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    form.value.expiry_date = value.substring(0, 5);
};

const handleSubmit = async () => {
    if (isSubmitting.value) return; // Prevent multiple submissions

    isSubmitting.value = true;

    try {
        const formData = {
            ...form.value,
            // Strip whitespace from card number before sending to backend
            card_number: form.value.card_number.replace(/\s/g, ''),
            cart_items: cartItems.value,
        };
        await router.post('/checkout', formData);
    } catch (error) {
        console.error('Checkout error:', error);
        // Re-enable the button on error so user can try again
        isSubmitting.value = false;
    }
    // Note: We don't set isSubmitting to false on success because we're redirecting
};

const handleCartClick = () => {
    router.visit('/cart');
};

// Lifecycle
onMounted(() => {
    const items = getItems();
    // Transform the cart items to match our interface
    cartItems.value = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
    }));
    cartItemCount.value = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

    // Redirect if cart is empty
    if (cartItems.value.length === 0) {
        router.visit('/cart');
    }
});
</script>
