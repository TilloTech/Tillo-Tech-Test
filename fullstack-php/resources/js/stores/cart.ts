import { defineStore } from 'pinia';
import type { Product } from '@/types/product';

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

interface CartState {
  items: CartItem[];
  toasts: Toast[];
}

// Allow configurable storage key for testing
const CART_KEY = (typeof window !== 'undefined' && (window as any).__TEST_CART_KEY) || 'cart_items';

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    toasts: [],
  }),

  getters: {
    totalCount: (state: CartState) => state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    
    totalPrice: (state: CartState) => state.items.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0),
    
    isEmpty: (state: CartState) => state.items.length === 0,
    
    getItemById: (state: CartState) => (productId: number) => 
      state.items.find((item: CartItem) => item.product.id === productId),
  },

  actions: {
    initialize() {
      if (typeof window === 'undefined') return;
      
      const data = localStorage.getItem(CART_KEY);
      if (data) {
        try {
          this.items = JSON.parse(data);
        } catch {
          this.items = [];
        }
      }
    },

    saveToStorage() {
      if (typeof window === 'undefined') return;
      localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    },

    addToCart(product: Product, quantity = 1) {
      const existing = this.items.find(item => item.product.id === product.id);
      
      if (existing) {
        existing.quantity += quantity;
        this.showToast(`Updated quantity of ${product.name} in cart`, 'success');
      } else {
        this.items.push({ product, quantity });
        this.showToast(`${product.name} added to cart`, 'success');
      }
      
      this.saveToStorage();
    },

    removeFromCart(productId: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.showToast(`${item.product.name} removed from cart`, 'info');
        this.saveToStorage();
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = quantity;
          this.showToast(`Updated quantity of ${item.product.name}`, 'success');
          this.saveToStorage();
        }
      }
    },

    clearCart() {
      this.items = [];
      this.showToast('Cart cleared', 'info');
      this.saveToStorage();
    },

    showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
      const id = Date.now();
      const toast: Toast = { id, message, type, duration };
      this.toasts.push(toast);

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },

    removeToast(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },

    // Testing utilities
    resetState() {
      this.items = [];
      this.toasts = [];
    },
  },
}); 