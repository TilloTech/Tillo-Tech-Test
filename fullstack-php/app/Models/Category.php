<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the color associated with this category.
     */
    public function getColor(): string
    {
        return match ($this->name) {
            'Electronics' => 'blue',
            'Clothing' => 'green',
            'Home & Garden' => 'orange',
            'Sports' => 'red',
            default => 'gray'
        };
    }
}
