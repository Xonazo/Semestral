<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTraspasosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('traspasos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_bodega_origen');
            $table->unsignedBigInteger('id_bodega_destino');
            $table->string('guia');
            $table->timestamps();

            $table->foreign('id_bodega_origen')->references('id')->on('bodegas');
            $table->foreign('id_bodega_destino')->references('id')->on('bodegas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traspasos');
    }
}
