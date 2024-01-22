<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'statut',
        'prix',
        'session_id',
        'terrain_id',
        'date_debut',
        'date_fin',
    ];
}
