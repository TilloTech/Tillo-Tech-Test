// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Cart Configuration
export const CART_CONFIG = {
  STORAGE_KEY: 'cart_items',
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  INFO_DURATION: 3000,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PER_PAGE: 25,
  MAX_PER_PAGE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  CARD_NUMBER: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
  CVV: /^\d{3,4}$/,
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
  POSTCODE: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
} as const;

// Product Configuration
export const PRODUCT_CONFIG = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
  MAX_RATING: 5,
  MIN_RATING: 1,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'theme',
  DEFAULT_THEME: 'light',
  THEMES: ['light', 'dark'] as const,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ITEM_ADDED_TO_CART: 'Item added to cart successfully.',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart successfully.',
  CART_CLEARED: 'Cart cleared successfully.',
  ORDER_PLACED: 'Order placed successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
} as const;

// Route Names (for type safety)
export const ROUTES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  CART: 'cart',
  CHECKOUT: 'checkout.index',
  CHECKOUT_CONFIRMATION: 'checkout.confirmation',
  PRODUCTS_SHOW: 'products.show',
  PAYMENT_PROCESS: 'payment.process',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart_items',
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
} as const; 