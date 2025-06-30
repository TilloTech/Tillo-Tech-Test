<?php

declare(strict_types=1);

namespace App\DTO\Cart;

use InvalidArgumentException;

readonly class CartItem
{
    public function __construct(
        public int $productId,
        public string $name,
        public float $price,
        public int $quantity,
        public ?string $image = null
    ) {
        $this->validate();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['product_id'] ?? $data['id'] ?? throw new InvalidArgumentException('Product ID is required'),
            $data['name'] ?? throw new InvalidArgumentException('Product name is required'),
            (float) ($data['price'] ?? throw new InvalidArgumentException('Product price is required')),
            (int) ($data['quantity'] ?? throw new InvalidArgumentException('Quantity is required')),
            $data['image'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'product_id' => $this->productId,
            'name' => $this->name,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image' => $this->image,
        ];
    }

    public function getSubtotal(): float
    {
        return $this->price * $this->quantity;
    }

    private function validate(): void
    {
        if ($this->productId <= 0) {
            throw new InvalidArgumentException('Product ID must be a positive integer');
        }

        if (empty(trim($this->name))) {
            throw new InvalidArgumentException('Product name cannot be empty');
        }

        if ($this->price < 0) {
            throw new InvalidArgumentException('Price cannot be negative');
        }

        if ($this->quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be a positive integer');
        }
    }
}
