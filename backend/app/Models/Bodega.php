<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bodega extends Model
{
    use HasFactory;

    protected $table = 'bodegas';
    protected $primaryKey = 'id'; 

    protected $fillable = ['nombre'];

    public function stock()
{
    return $this->hasMany(Stock::class, 'id_bodega');
}

public function ingresos()
{
    return $this->hasMany(Ingreso::class, 'id_bodega');

}



}

