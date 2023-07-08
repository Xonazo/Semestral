<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('detalles_ingresos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ingreso_id') ->nullable(false);
            $table->unsignedBigInteger('bebida_id') ->nullable(false);
            $table->integer('cantidad') ->nullable(false);

            $table->foreign('ingreso_id')->references('id')->on('ingresos');
            $table->foreign('bebida_id')->references('id')->on('bebidas');
        });
    }

    public function down()
    {
        Schema::dropIfExists('detalles_ingresos');
    }
};
