<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="flex justify-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 8V6a6 6 0 0 1 12 0v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2z" />
                        <path d="M8 8h8" stroke="currentColor" stroke-width="1.5" fill="none" />
                        <path d="M9 6a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                </div>
            </div>
            <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Or
                <Link :href="route('register')" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    create a new account
                </Link>
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
                <form @submit.prevent="submit" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <div class="mt-1">
                            <input
                                id="email"
                                v-model="form.email"
                                type="email"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                :class="{ 'border-red-500': errors.email }"
                            />
                        </div>
                        <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400">
                            {{ errors.email }}
                        </p>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div class="mt-1">
                            <input
                                id="password"
                                v-model="form.password"
                                type="password"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                :class="{ 'border-red-500': errors.password }"
                            />
                        </div>
                        <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-400">
                            {{ errors.password }}
                        </p>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input
                                id="remember"
                                v-model="form.remember"
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label for="remember" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 dark:focus:ring-offset-gray-800"
                        >
                            <span v-if="isSubmitting">Signing in...</span>
                            <span v-else>Sign in</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const isSubmitting = ref(false);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const props = defineProps<{
    errors: Record<string, string>;
}>();

const submit = () => {
    isSubmitting.value = true;
    form.post(route('login'), {
        onFinish: () => {
            isSubmitting.value = false;
        },
    });
};
</script> 