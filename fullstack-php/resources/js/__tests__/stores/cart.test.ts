import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import type { Product } from '@/types/product';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock setTimeout
vi.useFakeTimers();

describe('Cart Store', () => {
  let store: any;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    price: 29.99,
    image: '/test-image.jpg',
    category: { id: 1, name: 'Electronics' },
    reviews: [],
    reviews_count: 0,
    category_color: 'blue',
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Test Product 2',
    description: 'Another test product',
    price: 19.99,
    image: '/test-image-2.jpg',
    category: { id: 1, name: 'Electronics' },
    reviews: [],
    reviews_count: 0,
    category_color: 'blue',
  };

  beforeEach(async () => {
    setActivePinia(createPinia());
    
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Set test cart key before importing the store
    (window as any).__TEST_CART_KEY = 'test_cart_items';
    
    // Import the store after setting the test key
    const { useCartStore } = await import('@/stores/cart');
    store = useCartStore();
    store.resetState();
  });

  afterEach(() => {
    vi.clearAllTimers();
    delete (window as any).__TEST_CART_KEY;
  });

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      expect(store.items).toEqual([]);
      expect(store.toasts).toEqual([]);
    });

    it('should load cart from localStorage on initialization', async () => {
      const savedCart = [{ product: mockProduct, quantity: 2 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));
      
      // Create new store instance to trigger initialization
      const { useCartStore } = await import('@/stores/cart');
      const newStore = useCartStore();
      newStore.initialize();
      
      expect(newStore.items).toEqual(savedCart);
      expect(newStore.totalCount).toBe(2);
    });

    it('should handle invalid localStorage data gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const { useCartStore } = await import('@/stores/cart');
      const newStore = useCartStore();
      newStore.initialize();
      
      expect(newStore.items).toEqual([]);
    });
  });

  describe('Getters', () => {
    it('should calculate total count correctly', () => {
      store.items = [
        { product: mockProduct, quantity: 2 },
        { product: mockProduct2, quantity: 3 },
      ];

      expect(store.totalCount).toBe(5);
    });

    it('should calculate total price correctly', () => {
      store.items = [
        { product: mockProduct, quantity: 2 }, // 29.99 * 2 = 59.98
        { product: mockProduct2, quantity: 1 }, // 19.99 * 1 = 19.99
      ];

      expect(store.totalPrice).toBe(79.97);
    });

    it('should return true for empty cart', () => {
      expect(store.isEmpty).toBe(true);
      
      store.items = [{ product: mockProduct, quantity: 1 }];
      expect(store.isEmpty).toBe(false);
    });

    it('should find item by product ID', () => {
      store.items = [
        { product: mockProduct, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ];

      const foundItem = store.getItemById(mockProduct.id);
      expect(foundItem).toEqual({ product: mockProduct, quantity: 2 });

      const notFoundItem = store.getItemById(999);
      expect(notFoundItem).toBeUndefined();
    });
  });

  describe('Actions', () => {
    describe('addToCart', () => {
      it('should add new product to cart', () => {
        store.addToCart(mockProduct);

        expect(store.items).toHaveLength(1);
        expect(store.items[0].product).toEqual(mockProduct);
        expect(store.items[0].quantity).toBe(1);
        expect(store.totalCount).toBe(1);
      });

      it('should increase quantity when adding same product', () => {
        store.addToCart(mockProduct);
        store.addToCart(mockProduct);

        expect(store.items).toHaveLength(1);
        expect(store.items[0].quantity).toBe(2);
        expect(store.totalCount).toBe(2);
      });

      it('should add product with custom quantity', () => {
        store.addToCart(mockProduct, 3);

        expect(store.items[0].quantity).toBe(3);
        expect(store.totalCount).toBe(3);
      });

      it('should save to localStorage when adding items', () => {
        store.addToCart(mockProduct);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'test_cart_items',
          JSON.stringify([{ product: mockProduct, quantity: 1 }])
        );
      });

      it('should show success toast when adding new product', () => {
        store.addToCart(mockProduct);

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Test Product added to cart');
        expect(store.toasts[0].type).toBe('success');
      });

      it('should show update toast when increasing quantity', () => {
        store.addToCart(mockProduct);
        store.addToCart(mockProduct);

        expect(store.toasts).toHaveLength(2);
        expect(store.toasts[1].message).toBe('Updated quantity of Test Product in cart');
        expect(store.toasts[1].type).toBe('success');
      });
    });

    describe('removeFromCart', () => {
      beforeEach(() => {
        store.items = [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ];
      });

      it('should remove product from cart', () => {
        store.removeFromCart(mockProduct.id);

        expect(store.items).toHaveLength(1);
        expect(store.items[0].product.id).toBe(mockProduct2.id);
        expect(store.totalCount).toBe(1);
      });

      it('should not affect cart when removing non-existent product', () => {
        store.removeFromCart(999);

        expect(store.items).toHaveLength(2);
        expect(store.totalCount).toBe(3);
      });

      it('should save to localStorage when removing items', () => {
        store.removeFromCart(mockProduct.id);

        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should show info toast when removing product', () => {
        store.removeFromCart(mockProduct.id);

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Test Product removed from cart');
        expect(store.toasts[0].type).toBe('info');
      });
    });

    describe('updateQuantity', () => {
      beforeEach(() => {
        store.items = [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ];
      });

      it('should update product quantity', () => {
        store.updateQuantity(mockProduct.id, 5);

        expect(store.items[0].quantity).toBe(5);
        expect(store.totalCount).toBe(6);
      });

      it('should remove product when quantity is 0', () => {
        store.updateQuantity(mockProduct.id, 0);

        expect(store.items).toHaveLength(1);
        expect(store.items[0].product.id).toBe(mockProduct2.id);
        expect(store.totalCount).toBe(1);
      });

      it('should remove product when quantity is negative', () => {
        store.updateQuantity(mockProduct.id, -1);

        expect(store.items).toHaveLength(1);
        expect(store.items[0].product.id).toBe(mockProduct2.id);
        expect(store.totalCount).toBe(1);
      });

      it('should not affect cart when updating non-existent product', () => {
        store.updateQuantity(999, 5);

        expect(store.items).toHaveLength(2);
        expect(store.totalCount).toBe(3);
      });

      it('should save to localStorage when updating quantity', () => {
        store.updateQuantity(mockProduct.id, 5);

        expect(localStorageMock.setItem).toHaveBeenCalled();
      });

      it('should show success toast when updating quantity', () => {
        store.updateQuantity(mockProduct.id, 5);

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Updated quantity of Test Product');
        expect(store.toasts[0].type).toBe('success');
      });
    });

    describe('clearCart', () => {
      beforeEach(() => {
        store.items = [
          { product: mockProduct, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ];
      });

      it('should clear all items from cart', () => {
        store.clearCart();

        expect(store.items).toEqual([]);
        expect(store.totalCount).toBe(0);
        expect(store.isEmpty).toBe(true);
      });

      it('should save to localStorage when clearing cart', () => {
        store.clearCart();

        expect(localStorageMock.setItem).toHaveBeenCalledWith('test_cart_items', JSON.stringify([]));
      });

      it('should show info toast when clearing cart', () => {
        store.clearCart();

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Cart cleared');
        expect(store.toasts[0].type).toBe('info');
      });
    });

    describe('Toast Management', () => {
      it('should show toast with default duration', () => {
        store.showToast('Test message');

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Test message');
        expect(store.toasts[0].type).toBe('info');
        expect(store.toasts[0].duration).toBe(3000);
      });

      it('should show toast with custom duration', () => {
        store.showToast('Test message', 'success', 5000);

        expect(store.toasts[0].duration).toBe(5000);
      });

      it('should remove toast after duration', async () => {
        store.showToast('Test message', 'info', 1000);

        expect(store.toasts).toHaveLength(1);

        await vi.advanceTimersByTimeAsync(1000);

        expect(store.toasts).toHaveLength(0);
      });

      it('should remove specific toast by ID', () => {
        store.showToast('Message 1');
        store.showToast('Message 2');

        expect(store.toasts).toHaveLength(2);

        const toastId = store.toasts[0].id;
        store.removeToast(toastId);

        expect(store.toasts).toHaveLength(1);
        expect(store.toasts[0].message).toBe('Message 2');
      });

      it('should handle removing non-existent toast', () => {
        store.showToast('Test message');

        store.removeToast(999);

        expect(store.toasts).toHaveLength(1);
      });
    });

    describe('Persistence', () => {
      it('should save cart to localStorage', () => {
        store.items = [{ product: mockProduct, quantity: 2 }];
        store.saveToStorage();

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'test_cart_items',
          JSON.stringify([{ product: mockProduct, quantity: 2 }])
        );
      });

      it('should not save to localStorage in SSR environment', () => {
        // Mock window as undefined to simulate SSR
        const originalWindow = global.window;
        delete (global as any).window;

        store.saveToStorage();

        expect(localStorageMock.setItem).not.toHaveBeenCalled();

        // Restore window
        global.window = originalWindow;
      });
    });

    describe('Testing Utilities', () => {
      it('should reset state for testing', () => {
        store.items = [{ product: mockProduct, quantity: 1 }];
        store.toasts = [{ id: 1, message: 'Test', type: 'info' }];

        store.resetState();

        expect(store.items).toEqual([]);
        expect(store.toasts).toEqual([]);
      });
    });
  });
}); 