<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIngresosTable extends Migration
{
    public function up()
    {
        Schema::create('ingresos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_bodega');
            $table->string('guia');
            $table->timestamps();

            $table->foreign('id_bodega')->references('id')->on('bodegas');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ingresos');
    }
}
