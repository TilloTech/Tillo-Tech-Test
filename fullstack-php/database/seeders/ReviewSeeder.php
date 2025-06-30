<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        foreach ($products as $product) {
            Review::create([
                'product_id' => $product->id,
                'author' => 'Alice',
                'content' => 'Great product! Highly recommend.',
                'rating' => rand(4, 5),
            ]);
            Review::create([
                'product_id' => $product->id,
                'author' => 'Bob',
                'content' => 'Good value for money.',
                'rating' => rand(3, 5),
            ]);
            Review::create([
                'product_id' => $product->id,
                'author' => 'Charlie',
                'content' => 'Would buy again.',
                'rating' => rand(3, 5),
            ]);
        }
    }
}
