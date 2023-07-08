<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingreso extends Model
{
    protected $table = 'ingresos';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'id_bodega',
        'guia',
    ];

    public function detalles()
    {
        return $this->hasMany(DetalleIngreso::class, 'ingreso_id');
    }

    public function bodega()
{
    return $this->belongsTo(Bodega::class, 'id_bodega');
}

}
