<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleIngreso extends Model
{
    protected $table = 'detalles_ingresos';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'ingreso_id',
        'bebida_id',
        'cantidad',
    ];

    public function bebida()
    {
        return $this->belongsTo(Bebida::class, 'bebida_id');
    }
}
