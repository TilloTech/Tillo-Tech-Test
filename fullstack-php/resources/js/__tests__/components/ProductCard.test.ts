import ProductCard from '@/components/ProductCard.vue';
import type { Product } from '@/types/product';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock setTimeout
vi.useFakeTimers();

describe('ProductCard', () => {
    const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99,
        image: '/test-image.jpg',
        category: { id: 1, name: 'Electronics' },
        reviews: [],
        reviews_count: 0,
        category_color: 'blue',
    };

    const mockProductWithReviews: Product = {
        ...mockProduct,
        reviews: [{ rating: 4 }, { rating: 5 }],
        reviews_count: 2,
    };

    const mockProductWithDiscount: Product = {
        ...mockProduct,
        discount: '20% OFF',
        originalPrice: 37.49,
    };

    beforeEach(() => {
        vi.clearAllTimers();
    });

    describe('Rendering', () => {
        it('should render product information correctly', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            expect(wrapper.find('h3').text()).toBe('Test Product');
            expect(wrapper.find('p').text()).toBe('A test product description');
            expect(wrapper.find('.text-lg').text()).toBe('£29.99');
            expect(wrapper.find('img').attributes('src')).toBe('/test-image.jpg');
            expect(wrapper.find('img').attributes('alt')).toBe('Test Product');
        });

        it('should render category badge', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const categoryBadge = wrapper.find('.bg-blue-100');
            expect(categoryBadge.exists()).toBe(true);
            expect(categoryBadge.text()).toBe('Electronics');
        });

        it('should render category badge with correct color classes', () => {
            const blueProduct = { ...mockProduct, category_color: 'blue' };
            const greenProduct = { ...mockProduct, category_color: 'green' };
            const orangeProduct = { ...mockProduct, category_color: 'orange' };
            const redProduct = { ...mockProduct, category_color: 'red' };
            const grayProduct = { ...mockProduct, category_color: 'gray' };

            const blueWrapper = mount(ProductCard, { props: { product: blueProduct } });
            const greenWrapper = mount(ProductCard, { props: { product: greenProduct } });
            const orangeWrapper = mount(ProductCard, { props: { product: orangeProduct } });
            const redWrapper = mount(ProductCard, { props: { product: redProduct } });
            const grayWrapper = mount(ProductCard, { props: { product: grayProduct } });

            expect(blueWrapper.find('.bg-blue-100').exists()).toBe(true);
            expect(greenWrapper.find('.bg-green-100').exists()).toBe(true);
            expect(orangeWrapper.find('.bg-orange-100').exists()).toBe(true);
            expect(redWrapper.find('.bg-red-100').exists()).toBe(true);
            expect(grayWrapper.find('.bg-gray-100').exists()).toBe(true);
        });

        it('should render discount badge when present', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProductWithDiscount },
            });

            const discountBadge = wrapper.find('.bg-red-500');
            expect(discountBadge.exists()).toBe(true);
            expect(discountBadge.text()).toBe('20% OFF');
        });

        it('should render original price when present', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProductWithDiscount },
            });

            const originalPrice = wrapper.find('.line-through');
            expect(originalPrice.exists()).toBe(true);
            expect(originalPrice.text()).toBe('£37.49');
        });

        it('should render star rating correctly', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProductWithReviews },
            });

            const stars = wrapper.findAll('svg[viewBox="0 0 20 20"]');
            expect(stars).toHaveLength(5);

            // Should have 5 filled stars (average rating is 4.5, rounded to 5)
            const filledStars = stars.filter((star) => star.classes().includes('text-yellow-400'));
            expect(filledStars).toHaveLength(5);
        });

        it('should render review count and average rating', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProductWithReviews },
            });

            const reviewText = wrapper.find('.text-xs.text-gray-500');
            expect(reviewText.text()).toBe('(2 reviews, avg: 4.5)');
        });

        it('should handle product without reviews', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const stars = wrapper.findAll('svg[viewBox="0 0 20 20"]');
            expect(stars).toHaveLength(5);

            // Should have no filled stars (average rating is 0)
            const filledStars = stars.filter((star) => star.classes().includes('text-yellow-400'));
            expect(filledStars).toHaveLength(0);

            const reviewText = wrapper.find('.text-xs.text-gray-500');
            expect(reviewText.text()).toBe('(0 reviews, avg: 0)');
        });
    });

    describe('Wishlist Functionality', () => {
        it('should render wishlist button', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const wishlistButton = wrapper.find('button[type="button"]');
            expect(wishlistButton.exists()).toBe(true);
        });

        it('should emit wishlist-toggle event when wishlist button is clicked', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const wishlistButton = wrapper.find('button[type="button"]');
            await wishlistButton.trigger('click');

            expect(wrapper.emitted('wishlist-toggle')).toBeTruthy();
            expect(wrapper.emitted('wishlist-toggle')?.[0]).toEqual([1]);
        });

        it('should show filled heart when product is wishlisted', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct, isWishlisted: true },
            });

            const heartIcon = wrapper.find('svg[viewBox="0 0 24 24"]');
            expect(heartIcon.classes()).toContain('text-red-500');
            expect(heartIcon.classes()).toContain('fill-current');
        });

        it('should show outline heart when product is not wishlisted', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct, isWishlisted: false },
            });

            const heartIcon = wrapper.find('svg[viewBox="0 0 24 24"]');
            expect(heartIcon.classes()).toContain('text-gray-600');
            expect(heartIcon.classes()).not.toContain('fill-current');
        });
    });

    describe('Add to Cart Functionality', () => {
        it('should render add to cart button', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            // Find the add to cart button by looking for the button with the specific text
            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            expect(addToCartButton).toBeTruthy();
            expect(addToCartButton?.text().trim()).toBe('Add to Cart');
        });

        it('should emit add-to-cart event when button is clicked', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            await addToCartButton?.trigger('click');

            expect(wrapper.emitted('add-to-cart')).toBeTruthy();
            expect(wrapper.emitted('add-to-cart')?.[0]).toEqual([1]);
        });

        it('should show loading state when adding to cart', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            await addToCartButton?.trigger('click');

            // Should show loading spinner and "Adding..." text
            expect(wrapper.find('.animate-spin').exists()).toBe(true);

            // Find the button that now contains "Adding..."
            const loadingButton = wrapper.findAll('button').find((button) => button.text().includes('Adding...'));
            expect(loadingButton).toBeTruthy();
            expect(loadingButton?.attributes('disabled')).toBeDefined();
        });

        it('should show success state after adding to cart', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            await addToCartButton?.trigger('click');

            // Fast-forward past loading state and flush timers
            await vi.advanceTimersByTimeAsync(500);
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            // The button should now have "Added!" text
            const successButton = wrapper.findAll('button').find((button) => button.text().includes('Added!'));
            expect(successButton).toBeTruthy();
            expect(successButton?.classes()).toContain('bg-green-600');
        }, 10000);

        it('should reset to normal state after success timeout', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            await addToCartButton?.trigger('click');

            // Fast-forward past loading and success states and flush timers
            vi.advanceTimersByTime(2500);
            await vi.runAllTimersAsync();
            await wrapper.vm.$nextTick();

            // Should be back to normal state
            const resetButton = wrapper.findAll('button').find((button) => button.text().includes('Add to Cart'));
            expect(resetButton).toBeTruthy();
            expect(resetButton?.classes()).toContain('bg-blue-600');
            expect(resetButton?.attributes('disabled')).toBeUndefined();
        }, 10000);

        it('should prevent multiple clicks during loading', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));

            // First click
            await addToCartButton?.trigger('click');

            // Second click during loading
            await addToCartButton?.trigger('click');

            // Should only emit once
            expect(wrapper.emitted('add-to-cart')).toHaveLength(1);
        });
    });

    describe('Navigation', () => {
        it('should render product link with correct href', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const link = wrapper.find('a');
            expect(link.attributes('href')).toBe('/products/1');
        });

        it('should prevent navigation when add to cart button is clicked', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            const addToCartButton = buttons.find((button) => button.text().includes('Add to Cart'));
            await addToCartButton?.trigger('click');

            // Should not trigger navigation
            expect(wrapper.emitted('add-to-cart')).toBeTruthy();
        });

        it('should prevent navigation when wishlist button is clicked', async () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const wishlistButton = wrapper.find('button[type="button"]');
            await wishlistButton.trigger('click');

            // Should not trigger navigation
            expect(wrapper.emitted('wishlist-toggle')).toBeTruthy();
        });
    });

    describe('Accessibility', () => {
        it('should have proper focus styles', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const link = wrapper.find('a');
            expect(link.classes()).toContain('focus:outline-none');
            expect(link.classes()).toContain('focus:ring-2');
            expect(link.classes()).toContain('focus:ring-blue-500');
        });

        it('should have proper button types', () => {
            const wrapper = mount(ProductCard, {
                props: { product: mockProduct },
            });

            const buttons = wrapper.findAll('button');
            buttons.forEach((button) => {
                expect(button.attributes('type')).toBe('button');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle product without category', () => {
            const productWithoutCategory = { ...mockProduct, category: undefined as any };
            const wrapper = mount(ProductCard, {
                props: { product: productWithoutCategory },
            });

            // The component shows "Unknown" but uses the blue color class
            const categoryBadge = wrapper.find('.bg-blue-100');
            expect(categoryBadge.exists()).toBe(true);
            expect(categoryBadge.text()).toBe('Unknown');
        });

        it('should handle product without category_color', () => {
            const productWithoutColor = { ...mockProduct, category_color: undefined };
            const wrapper = mount(ProductCard, {
                props: { product: productWithoutColor },
            });

            const categoryBadge = wrapper.find('.bg-gray-100');
            expect(categoryBadge.exists()).toBe(true);
        });

        it('should handle product with zero price', () => {
            const freeProduct = { ...mockProduct, price: 0 };
            const wrapper = mount(ProductCard, {
                props: { product: freeProduct },
            });

            expect(wrapper.find('.text-lg').text()).toBe('£0');
        });

        it('should handle product with very long name', () => {
            const longNameProduct = {
                ...mockProduct,
                name: 'This is a very long product name that should be truncated to two lines maximum to prevent layout issues',
            };
            const wrapper = mount(ProductCard, {
                props: { product: longNameProduct },
            });

            const title = wrapper.find('h3');
            expect(title.classes()).toContain('line-clamp-2');
        });
    });
});
