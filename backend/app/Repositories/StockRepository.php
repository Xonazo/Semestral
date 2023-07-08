<?php

namespace App\Repositories;

use App\Models\Stock;
use App\Models\Bodega;
use App\Models\Bebida;
use App\Models\Ingreso;
use App\Models\DetalleIngreso;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class StockRepository{


    public function viewAllStock()
{
    try {
        $stock = Stock::with('bebida', 'bodega')
            ->get()
            ->filter(function ($item) {
                return $item->id_bodega !== null || $item->id_bodega === null;
            })
            ->groupBy('id_bodega')
            ->map(function ($items, $idBodega) {
                $bodega = Bodega::find($idBodega);
                $nombreBodega = $bodega ? $bodega->nombre : 'Sin bodega';

                return [
                    'id_bodega' => $idBodega,
                    'nombre_bodega' => $nombreBodega,
                    'items' => $items->map(function ($item) {
                        return [
                            'bebida_id' => $item->bebida_id,
                            'cantidad' => $item->cantidad,
                            'nombre_bebida' => $item->bebida->nombre,
                            'formato_bebida' => $item->bebida->formato,
                        ];
                    }),
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Stock obtenido correctamente',
            'stock' => $stock
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Error al obtener el stock',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

public function view(Request $request)
{
    try {
        $idBodega = $request->input('id_bodega');

        $stock = Stock::with('bebida', 'bodega')
            ->when($idBodega, function ($query) use ($idBodega) {
                $query->where('id_bodega', $idBodega);
            })
            ->get()
            ->filter(function ($item) {
                return $item->id_bodega !== null || $item->id_bodega === null;
            })
            ->groupBy('id_bodega')
            ->map(function ($items, $idBodega) {
                $bodega = Bodega::find($idBodega);
                $nombreBodega = $bodega ? $bodega->nombre : 'Sin bodega';

                return [
                    'id_bodega' => $idBodega,
                    'nombre_bodega' => $nombreBodega,
                    'items' => $items->map(function ($item) {
                        return [
                            'bebida_id' => $item->bebida_id,
                            'cantidad' => $item->cantidad,
                            'nombre_bebida' => $item->bebida->nombre,
                            'formato_bebida' => $item->bebida->formato,
                        ];
                    }),
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Stock obtenido correctamente',
            'stock' => $stock
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Error al obtener el stock',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


}