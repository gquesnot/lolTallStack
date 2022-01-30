<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Champion extends Model
{
    use HasFactory;
    protected $table = 'champions';
    protected $casts = [
        'stats' => 'array',
    ];
    protected $fillable = [
        'name','stats', 'img'
    ];
    public $timestamps = false;


}
