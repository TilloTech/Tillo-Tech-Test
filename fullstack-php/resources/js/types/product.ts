export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    discount?: string;
    category: Category;
    reviews_count?: number;
    reviews?: { rating: number }[];
    category_color?: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
    product?: Product;
}

export interface Order {
    id: number;
    order_number: string;
    shipping_name: string;
    shipping_email: string;
    shipping_phone?: string;
    shipping_address: string;
    shipping_address2?: string;
    shipping_city: string;
    shipping_postcode: string;
    shipping_country: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    payment_method: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}
