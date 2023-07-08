<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stock';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'id_bodega',
        'bebida_id',
        'cantidad',
    ];

    public function bebida()
    {
        return $this->belongsTo(Bebida::class, 'bebida_id');
    }

    public function ingreso()
    {
        return $this->belongsTo(Ingreso::class, 'ingreso_id');
    }

    public function bodega()
{
    return $this->belongsTo(Bodega::class, 'id_bodega');
}

}
