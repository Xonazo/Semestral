<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleTraspaso extends Model
{
    protected $table = 'detalles_traspasos';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'traspaso_id',
        'bebida_id',
        'cantidad',
    ];

    public function traspaso()
    {
        return $this->belongsTo(Traspaso::class, 'traspaso_id');
    }

    public function bebida()
    {
        return $this->belongsTo(Bebida::class, 'bebida_id');
    }
}
