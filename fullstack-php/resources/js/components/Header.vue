<template>
    <header class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="container mx-auto px-4 py-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <a href="/" class="flex items-center space-x-2">
                        <!-- Logo Icon -->
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <!-- Bag body -->
                                <path d="M6 8V6a6 6 0 0 1 12 0v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2z" />
                                <!-- Bag handles -->
                                <path d="M8 8h8" stroke="currentColor" stroke-width="1.5" fill="none" />
                                <!-- Bag opening -->
                                <path d="M9 6a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="1.5" fill="none" />
                            </svg>
                        </div>
                        <!-- Logo Text -->
                        <div class="flex flex-col">
                            <span class="text-xl leading-none font-bold text-gray-900 dark:text-white">TilloMart</span>
                            <span class="text-xs leading-none text-gray-500 dark:text-gray-400">Lifestyle Store</span>
                        </div>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <a
                        href="/cart"
                        class="relative rounded-full p-2 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l2.5 5m6-5l2.5 5M9 21h11"
                            />
                        </svg>
                        <span
                            v-if="cartCount > 0"
                            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        >
                            {{ cartCount }}
                        </span>
                    </a>

                    <!-- Authentication Section -->
                    <div v-if="!auth.user" class="flex items-center space-x-2">
                        <!-- Login Button -->
                        <Link
                            :href="route('login')"
                            class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-white"
                        >
                            Sign in
                        </Link>
                        <!-- Register Button -->
                        <Link
                            :href="route('register')"
                            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Sign up
                        </Link>
                    </div>

                    <!-- User Menu for Authenticated Users -->
                    <div v-else class="relative">
                        <button
                            @click="userMenuOpen = !userMenuOpen"
                            class="flex items-center space-x-2 rounded-full p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                                {{ auth.user.name.charAt(0).toUpperCase() }}
                            </div>
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <div
                            v-if="userMenuOpen"
                            class="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-50"
                        >
                            <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                <div class="font-medium">{{ auth.user.name }}</div>
                                <div class="text-gray-500 dark:text-gray-400">{{ auth.user.email }}</div>
                            </div>
                            <div class="border-t border-gray-100 dark:border-gray-700">
                                <form @submit.prevent="logout" method="POST">
                                    <button
                                        type="submit"
                                        class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import { useCart } from '../composables/useCart';

interface Props {
    title?: string;
}

withDefaults(defineProps<Props>(), {
    title: 'Product Catalogue',
});

const { totalCount } = useCart();
const cartCount = computed(() => totalCount.value);

const page = usePage();
const auth = computed(() => page.props.auth);

const userMenuOpen = ref(false);

const logout = () => {
    useForm({}).post(route('logout'));
};
</script>
