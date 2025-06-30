import type { Product } from '@/types/product';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('useCart', () => {
    let cart: any;

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
        // Clear all mocks
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);

        // Set test cart key before importing
        (window as any).__TEST_CART_KEY = 'test_cart_items';

        // Dynamically import the composable to ensure it uses the test key
        const { useCart } = await import('@/composables/useCart');
        cart = useCart();
        cart.resetState();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    afterAll(() => {
        // Clean up test cart key
        delete (window as any).__TEST_CART_KEY;
    });

    describe('Cart State Management', () => {
        it('should initialize with empty cart', () => {
            expect(cart.cartItems.value).toEqual([]);
            expect(cart.totalCount.value).toBe(0);
        });

        it('should add a product to cart', () => {
            cart.addToCart(mockProduct);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].product).toEqual(mockProduct);
            expect(cart.cartItems.value[0].quantity).toBe(1);
            expect(cart.totalCount.value).toBe(1);
        });

        it('should add multiple products to cart', () => {
            cart.addToCart(mockProduct);
            cart.addToCart(mockProduct2);

            expect(cart.cartItems.value).toHaveLength(2);
            expect(cart.totalCount.value).toBe(2);
        });

        it('should increase quantity when adding same product', () => {
            cart.addToCart(mockProduct);
            cart.addToCart(mockProduct);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].quantity).toBe(2);
            expect(cart.totalCount.value).toBe(2);
        });

        it('should add product with custom quantity', () => {
            cart.addToCart(mockProduct, 3);

            expect(cart.cartItems.value[0].quantity).toBe(3);
            expect(cart.totalCount.value).toBe(3);
        });
    });

    describe('Cart Item Management', () => {
        beforeEach(() => {
            cart.addToCart(mockProduct);
            cart.addToCart(mockProduct2);
        });

        it('should remove a product from cart', () => {
            cart.removeFromCart(mockProduct.id);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].product.id).toBe(mockProduct2.id);
            expect(cart.totalCount.value).toBe(1);
        });

        it('should update product quantity', () => {
            cart.updateQuantity(mockProduct.id, 5);

            expect(cart.cartItems.value[0].quantity).toBe(5);
            expect(cart.totalCount.value).toBe(6); // 5 + 1 (from product2)
        });

        it('should remove product when quantity is set to 0', () => {
            cart.updateQuantity(mockProduct.id, 0);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].product.id).toBe(mockProduct2.id);
            expect(cart.totalCount.value).toBe(1);
        });

        it('should remove product when quantity is negative', () => {
            cart.updateQuantity(mockProduct.id, -1);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].product.id).toBe(mockProduct2.id);
            expect(cart.totalCount.value).toBe(1);
        });

        it('should not affect cart when updating non-existent product', () => {
            cart.updateQuantity(999, 5);

            expect(cart.cartItems.value).toHaveLength(2);
            expect(cart.totalCount.value).toBe(2);
        });

        it('should not affect cart when removing non-existent product', () => {
            cart.removeFromCart(999);

            expect(cart.cartItems.value).toHaveLength(2);
            expect(cart.totalCount.value).toBe(2);
        });
    });

    describe('Cart Calculations', () => {
        it('should calculate total count correctly', () => {
            cart.addToCart(mockProduct, 2);
            cart.addToCart(mockProduct2, 3);

            expect(cart.totalCount.value).toBe(5);
        });

        it('should return correct items via getItems', () => {
            cart.addToCart(mockProduct, 2);
            cart.addToCart(mockProduct2, 1);

            const items = cart.getItems();
            expect(items).toHaveLength(2);
            expect(items[0].quantity).toBe(2);
            expect(items[1].quantity).toBe(1);
        });
    });

    describe('Cart Persistence', () => {
        it('should save cart to localStorage when items change', async () => {
            const { useCart } = await import('@/composables/useCart');
            const testCart = useCart();
            testCart.addToCart(mockProduct);
            await vi.runAllTimersAsync();
            expect(localStorageMock.setItem).toHaveBeenCalledWith('test_cart_items', JSON.stringify([{ product: mockProduct, quantity: 1 }]));
        });

        it('should load cart from localStorage on initialization', async () => {
            const savedCart = [{ product: mockProduct, quantity: 2 }];
            localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));
            vi.resetModules();
            const { useCart } = await import('@/composables/useCart');
            const newCart = useCart();
            expect(newCart.cartItems.value).toEqual(savedCart);
            expect(newCart.totalCount.value).toBe(2);
        });

        it('should handle invalid localStorage data gracefully', async () => {
            localStorageMock.getItem.mockReturnValue('invalid json');
            const { useCart } = await import('@/composables/useCart');
            const newCart = useCart();
            expect(newCart.cartItems.value).toEqual([]);
            expect(newCart.totalCount.value).toBe(0);
        });

        it('should handle null localStorage data gracefully', async () => {
            localStorageMock.getItem.mockReturnValue(null);
            const { useCart } = await import('@/composables/useCart');
            const newCart = useCart();
            expect(newCart.cartItems.value).toEqual([]);
            expect(newCart.totalCount.value).toBe(0);
        });
    });

    describe('Cart Clearing', () => {
        beforeEach(() => {
            cart.addToCart(mockProduct, 2);
            cart.addToCart(mockProduct2, 1);
        });

        it('should clear all items from cart', () => {
            cart.clearCart();

            expect(cart.cartItems.value).toEqual([]);
            expect(cart.totalCount.value).toBe(0);
        });

        it('should save empty cart to localStorage when cleared', () => {
            cart.clearCart();

            expect(localStorageMock.setItem).toHaveBeenCalledWith('test_cart_items', '[]');
        });
    });

    describe('Toast Notifications', () => {
        it('should show success toast when adding product', () => {
            cart.addToCart(mockProduct);

            expect(cart.toasts.value).toHaveLength(1);
            expect(cart.toasts.value[0].message).toBe('Test Product added to cart');
            expect(cart.toasts.value[0].type).toBe('success');
        });

        it('should show success toast when updating quantity', () => {
            cart.addToCart(mockProduct);
            cart.updateQuantity(mockProduct.id, 3);

            expect(cart.toasts.value).toHaveLength(2);
            expect(cart.toasts.value[1].message).toBe('Updated quantity of Test Product');
            expect(cart.toasts.value[1].type).toBe('success');
        });

        it('should show info toast when removing product', () => {
            cart.addToCart(mockProduct);
            cart.removeFromCart(mockProduct.id);

            expect(cart.toasts.value).toHaveLength(2);
            expect(cart.toasts.value[1].message).toBe('Test Product removed from cart');
            expect(cart.toasts.value[1].type).toBe('info');
        });

        it('should show info toast when clearing cart', () => {
            cart.addToCart(mockProduct);
            cart.clearCart();

            expect(cart.toasts.value).toHaveLength(2);
            expect(cart.toasts.value[1].message).toBe('Cart cleared');
            expect(cart.toasts.value[1].type).toBe('info');
        });

        it('should auto-remove toasts after duration', () => {
            cart.showToast('Test message', 'info', 1000);

            expect(cart.toasts.value).toHaveLength(1);

            // Fast-forward time
            vi.advanceTimersByTime(1000);

            expect(cart.toasts.value).toHaveLength(0);
        });

        it('should manually remove toast', () => {
            cart.showToast('Test message');

            const toastId = cart.toasts.value[0].id;
            cart.removeToast(toastId);

            expect(cart.toasts.value).toHaveLength(0);
        });

        it('should handle removing non-existent toast', () => {
            cart.showToast('Test message');

            cart.removeToast(999);

            expect(cart.toasts.value).toHaveLength(1);
        });

        it('should generate unique toast IDs', () => {
            const originalDateNow = Date.now;
            let callCount = 0;
            Date.now = vi.fn(() => {
                callCount++;
                return 1000 + callCount;
            });

            cart.showToast('Message 1');
            cart.showToast('Message 2');

            expect(cart.toasts.value[0].id).toBe(1001);
            expect(cart.toasts.value[1].id).toBe(1002);

            Date.now = originalDateNow;
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty cart operations gracefully', () => {
            expect(() => cart.removeFromCart(1)).not.toThrow();
            expect(() => cart.updateQuantity(1, 5)).not.toThrow();
            expect(() => cart.clearCart()).not.toThrow();
        });

        it('should handle products with zero price', () => {
            const freeProduct = { ...mockProduct, price: 0 };
            cart.addToCart(freeProduct);

            expect(cart.cartItems.value).toHaveLength(1);
            expect(cart.cartItems.value[0].product.price).toBe(0);
        });

        it('should handle very large quantities', () => {
            cart.addToCart(mockProduct, 1000);

            expect(cart.cartItems.value[0].quantity).toBe(1000);
            expect(cart.totalCount.value).toBe(1000);
        });
    });
});
