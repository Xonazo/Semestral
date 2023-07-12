<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetallesTraspasosTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detalles_traspasos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('traspaso_id');
            $table->unsignedBigInteger('bebida_id');
            $table->integer('cantidad');

            $table->foreign('traspaso_id')->references('id')->on('traspasos');
            $table->foreign('bebida_id')->references('id')->on('bebidas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_traspasos');
    }
}
