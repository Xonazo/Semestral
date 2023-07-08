<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bebida extends Model
{
    use HasFactory;

    public $table = "bebidas";
    protected $primeyKey = "id";
    public $timestamps = true;
    protected $fillable = [
        'nombre',
        'formato'
    ];

    public function detallesIngresos()
    {
        return $this->hasMany(DetalleIngreso::class, 'bebida_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'bebida_id');
    }

}
