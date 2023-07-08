<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traspaso extends Model
{
    use HasFactory;

    public $table = "traspasos";
    protected $primeyKey = "id";
    public $timestamps = true;
    protected $fillable = [
        'id_bodega_origen',
        'id_bodega_destino',
        'guia',
    ];

    public function bodegaOrigen(){
        return $this->belongsTo(Bodega::class, 'id_bodega_origen');
    }

    public function bodegaDestino(){
        return $this->belongsTo(Bodega::class, 'id_bodega_destino');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleIngreso::class, 'ingreso_id');
    }

}
