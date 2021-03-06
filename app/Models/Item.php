<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $table = 'items';
    protected $casts = [
        'stats' => 'array',
        'stats_description' => 'array',
    ];
    protected $fillable = [
        'name','stats', 'img', 'description', 'gold', 'colloq', 'tags'
    ];

}
