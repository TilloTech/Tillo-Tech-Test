<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <Header title="Product Catalogue" :cart-item-count="cartItemCount" @cart-click="handleCartClick" />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <!-- Filters and Search -->
            <ProductFilters
                :categories="categories"
                :initial-filters="filters"
                @search-change="handleSearchChange"
                @category-change="handleCategoryChange"
                @sort-change="handleSortChange"
            />

            <!-- Products Grid -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    :is-wishlisted="wishlistedProducts.includes(product.id)"
                    @add-to-cart="handleAddToCart"
                    @wishlist-toggle="handleWishlistToggle"
                />
            </div>

            <!-- No Products Message -->
            <div v-if="products.length === 0" class="py-12 text-center">
                <p class="text-lg text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="mt-12">
                <Pagination :current-page="pagination.current_page" :total-pages="pagination.last_page" @page-change="handlePageChange" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
import type { Product as ProductBase } from '@/types/product';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Pagination from '../components/Pagination.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductFilters from '../components/ProductFilters.vue';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Category {
    id: number;
    name: string;
}

interface Product extends ProductBase {
    category: Category;
}

interface Filters {
    search?: string;
    category?: number;
    sort?: string;
}

interface Props {
    products: Product[];
    pagination: PaginationData;
    filters: Filters;
    categories: Category[];
}

const props = defineProps<Props>();

// State
const cartItemCount = ref(0);
const wishlistedProducts = ref<number[]>([]);
const { addToCart } = useCart();

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null;

// Event handlers
const handleSearchChange = (query: string) => {
    console.log('Catalogue received search query:', JSON.stringify(query));
    console.log('Query length:', query.length);
    console.log('Contains spaces:', query.includes(' '));
    
    // Clear existing timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    searchTimeout = setTimeout(() => {
        console.log('Sending search to backend:', JSON.stringify(query));
        router.get(
            '/',
            {
                ...props.filters,
                search: query,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }, 300); // 300ms delay
};

const handleCategoryChange = (categoryId: number | string) => {
    router.get(
        '/',
        {
            ...props.filters,
            category: categoryId || undefined,
            page: 1,
        },
        {
            preserveState: true,
            replace: true,
        },
    );
};

const handleSortChange = (sort: string) => {
    router.get(
        '/',
        {
            ...props.filters,
            sort,
            page: 1,
        },
        {
            preserveState: true,
            replace: true,
        },
    );
};

const handlePageChange = (page: number) => {
    router.get(
        '/',
        {
            ...props.filters,
            page,
        },
        {
            preserveState: true,
            replace: true,
        },
    );
};

const handleAddToCart = (productId: number) => {
    const product = props.products.find((p) => p.id === productId);
    if (product) {
        addToCart(product);
    }
};

const handleWishlistToggle = (productId: number) => {
    const index = wishlistedProducts.value.indexOf(productId);
    if (index > -1) {
        wishlistedProducts.value.splice(index, 1);
    } else {
        wishlistedProducts.value.push(productId);
    }
};

const handleCartClick = () => {
    // In a real app, you'd navigate to cart page or open cart modal
};
</script>
