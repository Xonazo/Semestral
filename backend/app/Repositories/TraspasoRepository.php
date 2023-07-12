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

        $bodegaOrigen = Bodega::find($idBodegaOrigen);
        $bodegaDestino = Bodega::find($idBodegaDestino);
        if (!$bodegaOrigen || !$bodegaDestino) {
            throw new Exception('Una o ambas bodegas no existen');
        }

        DB::beginTransaction();

        foreach ($productos as $producto) {
            $bebidaId = $producto['bebida_id'];
            $cantidad = $producto['cantidad'];

            $stockOrigen = Stock::where('id_bodega', $idBodegaOrigen)
                ->where('bebida_id', $bebidaId)
                ->first();

            if (!$stockOrigen || $stockOrigen->cantidad < $cantidad) {
                throw new Exception('Stock insuficiente en la bodega de origen');
            }

            $stockOrigen->cantidad -= $cantidad;
            $stockOrigen->save();

            $stockDestino = Stock::updateOrCreate(
                ['id_bodega' => $idBodegaDestino, 'bebida_id' => $bebidaId],
                ['cantidad' => DB::raw('cantidad + ' . $cantidad)]
            );
        }

        DB::commit();

        $traspaso = Traspaso::create([
            'id_bodega_origen' => $idBodegaOrigen,
            'id_bodega_destino' => $idBodegaDestino,
            'guia' => $guia,
        ]);

        $nombreBodegaOrigen = $bodegaOrigen ? $bodegaOrigen->nombre : 'Sin bodega';
        $nombreBodegaDestino = $bodegaDestino ? $bodegaDestino->nombre : 'Sin bodega';

        $datosBebidas = collect($productos)->map(function ($producto) {
            $bebidaId = $producto['bebida_id'];
            $cantidad = $producto['cantidad'];

            $bebida = Bebida::find($bebidaId);

            return [
                'bebida_id' => $bebidaId,
                'cantidad' => $cantidad,
                'nombre_bebida' => $bebida ? $bebida->nombre : 'Sin bebida',
                'formato_bebida' => $bebida ? $bebida->formato : 'Sin formato',
            ];
        });

        return response()->json([
            'message' => 'Traspaso de stock realizado correctamente',
            'id_bodega_origen' => [
                'id' => $idBodegaOrigen,
                'nombre' => $nombreBodegaOrigen,
            ],
            'id_bodega_destino' => [
                'id' => $idBodegaDestino,
                'nombre' => $nombreBodegaDestino,
            ],
            'guia' => $guia,
            'bebidas' => $datosBebidas,
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

public function viewAll ()
{
    try {
        $traspasos = Traspaso::all();

        $datosTraspasos = $traspasos->map(function ($traspaso) {
            $bodegaOrigen = Bodega::find($traspaso->id_bodega_origen);
            $bodegaDestino = Bodega::find($traspaso->id_bodega_destino);

            return [
                'id' => $traspaso->id,
                'id_bodega_origen' => [
                    'id' => $bodegaOrigen ? $bodegaOrigen->id : null,
                    'nombre' => $bodegaOrigen ? $bodegaOrigen->nombre : 'Sin bodega',
                ],
                'id_bodega_destino' => [
                    'id' => $bodegaDestino ? $bodegaDestino->id : null,
                    'nombre' => $bodegaDestino ? $bodegaDestino->nombre : 'Sin bodega',
                ],
                'guia' => $traspaso->guia,
                'created_at' => $traspaso->created_at,
                'updated_at' => $traspaso->updated_at,
            ];
        });

        return response()->json([
            'message' => 'Traspasos obtenidos correctamente',
            'traspasos' => $datosTraspasos,
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        Log::error($e->getMessage());

        return response()->json([
            'message' => 'Error al obtener los traspasos',
            'error' => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}

public function viewOrigen($request)
{
    try {
        $idBodegaOrigen = $request->input('id_bodega_origen');

        $traspasos = Traspaso::with('bodegaOrigen', 'bodegaDestino', 'detalles.bebida')
            ->where('id_bodega_origen', $idBodegaOrigen)
            ->get();

        if ($traspasos->isEmpty()) {
            throw new Exception('No se encontraron traspasos para la bodega origen especificada');
        }

        return response()->json([
            'message' => 'Traspasos obtenidos correctamente',
            'traspasos' => $traspasos,
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        Log::error($e->getMessage());

        return response()->json([
            'message' => 'Error al obtener los traspasos',
            'error' => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}



}