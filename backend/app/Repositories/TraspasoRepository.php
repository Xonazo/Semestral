<?php

namespace App\Repositories;

use App\Models\Traspaso;
use App\Models\Stock;
use App\Models\Bodega;
use App\Models\Bebida;
use App\Models\Ingreso;
use App\Models\DetalleIngreso;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

class TraspasoRepository
{
    public function traspasarStock($request)
{
    try {
        $idBodegaOrigen = $request->input('id_bodega_origen');
        $idBodegaDestino = $request->input('id_bodega_destino');
        $guia = $request->input('guia');
        $productos = $request->input('productos');

        // Validar existencia de bodegas
        $bodegaOrigen = Bodega::find($idBodegaOrigen);
        $bodegaDestino = Bodega::find($idBodegaDestino);
        if (!$bodegaOrigen || !$bodegaDestino) {
            throw new Exception('Una o ambas bodegas no existen');
        }

        // Realizar traspaso de stock
        DB::beginTransaction();

        foreach ($productos as $producto) {
            $bebidaId = $producto['bebida_id'];
            $cantidad = $producto['cantidad'];

            // Verificar stock suficiente en bodega de origen
            $stockOrigen = Stock::where('id_bodega', $idBodegaOrigen)
                ->where('bebida_id', $bebidaId)
                ->first();

            if (!$stockOrigen || $stockOrigen->cantidad < $cantidad) {
                throw new Exception('Stock insuficiente en la bodega de origen');
            }

            // Actualizar stock en bodega de origen
            $stockOrigen->cantidad -= $cantidad;
            $stockOrigen->save();

            // Actualizar o crear stock en bodega de destino
            $stockDestino = Stock::updateOrCreate(
                ['id_bodega' => $idBodegaDestino, 'bebida_id' => $bebidaId],
                ['cantidad' => DB::raw('cantidad + ' . $cantidad)]
            );
        }

        DB::commit();

        // Obtener el traspaso recién creado
        $traspaso = Traspaso::create([
            'id_bodega_origen' => $idBodegaOrigen,
            'id_bodega_destino' => $idBodegaDestino,
            'guia' => $guia,
        ]);

        return response()->json([
            'message' => 'Traspaso de stock realizado correctamente',
            'traspaso' => $traspaso,
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        DB::rollBack();

        Log::error($e->getMessage());

        return response()->json([
            'message' => 'Error al realizar el traspaso de stock',
            'error' => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}

}
