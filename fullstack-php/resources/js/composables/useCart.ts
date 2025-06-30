import type { Product } from '@/types/product';
import { computed, ref, watch } from 'vue';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

// Allow configurable storage key for testing
const CART_KEY = (typeof window !== 'undefined' && (window as any).__TEST_CART_KEY) || 'cart_items';

const cartItems = ref<CartItem[]>([]);
const toasts = ref<Toast[]>([]);

function loadCart() {
    if (typeof window === 'undefined') return;

    const data = localStorage.getItem(CART_KEY);
    if (data) {
        try {
            cartItems.value = JSON.parse(data);
        } catch {
            cartItems.value = [];
        }
    }
}

function saveCart() {
    if (typeof window === 'undefined') return;

    localStorage.setItem(CART_KEY, JSON.stringify(cartItems.value));
}

// Load cart on composable import
loadCart();

// Persist cart on change
watch(cartItems, saveCart, { deep: true });

export function useCart() {
    // Add a product to the cart
    function addToCart(product: Product, quantity = 1) {
        const existing = cartItems.value.find((item) => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
            showToast(`Updated quantity of ${product.name} in cart`, 'success');
        } else {
            cartItems.value.push({ product, quantity });
            showToast(`${product.name} added to cart`, 'success');
        }
    }

    // Remove a product from the cart
    function removeFromCart(productId: number) {
        const item = cartItems.value.find((item) => item.product.id === productId);
        if (item) {
            cartItems.value = cartItems.value.filter((item) => item.product.id !== productId);
            showToast(`${item.product.name} removed from cart`, 'info');
        }
    }

    // Update quantity
    function updateQuantity(productId: number, quantity: number) {
        const item = cartItems.value.find((item) => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                showToast(`Updated quantity of ${item.product.name}`, 'success');
            }
        }
    }

    // Get all items
    function getItems() {
        return cartItems.value;
    }

    // Get total item count (sum of all quantities)
    const totalCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));

    // Clear cart
    function clearCart() {
        cartItems.value = [];
        showToast('Cart cleared', 'info');
    }

    // Toast functionality
    function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
        const id = Date.now();
        const toast: Toast = { id, message, type, duration };
        toasts.value.push(toast);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }

    function removeToast(id: number) {
        const index = toasts.value.findIndex((toast) => toast.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    // Testing utilities
    function resetState() {
        cartItems.value = [];
        toasts.value = [];
    }

    return {
        cartItems,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItems,
        totalCount,
        clearCart,
        showToast,
        removeToast,
        resetState, // For testing
    };
}
