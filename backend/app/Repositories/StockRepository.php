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
use Illuminate\Support\Facades\DB;

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


public function egreso(Request $request)
{
    try {
        $idBodega = $request->input('id_bodega');
        $productos = $request->input('productos');

        $bodega = Bodega::find($idBodega);
        if (!$bodega) {
            throw new Exception('La bodega no existe');
        }

        DB::beginTransaction();

        foreach ($productos as $producto) {
            $bebidaId = $producto['bebida_id'];
            $cantidad = $producto['cantidad'];

            $stock = Stock::where('id_bodega', $idBodega)
                ->where('bebida_id', $bebidaId)
                ->first();

            if (!$stock || $stock->cantidad < $cantidad) {
                throw new Exception('Stock insuficiente en la bodega');
            }

            $stock->cantidad -= $cantidad;
            $stock->save();
        }

        DB::commit();

        $datosBebidas = collect($productos)->map(function ($producto) use ($idBodega) {
            $bebidaId = $producto['bebida_id'];
            $cantidad = $producto['cantidad'];

            $bebida = Bebida::find($bebidaId);
            $nuevaCantidad = Stock::where('id_bodega', $idBodega)
                ->where('bebida_id', $bebidaId)
                ->value('cantidad');

            return [
                'bebida_id' => $bebidaId,
                'nombre_bebida' => $bebida ? $bebida->nombre : 'Sin bebida',
                'formato_bebida' => $bebida ? $bebida->formato : 'Sin formato',
                'cantidad_egresada' => $cantidad,
                'nueva_cantidad_de_stock' => $nuevaCantidad,
            ];
        });

        return response()->json([
            'message' => 'Egreso de stock realizado correctamente',
            'id_bodega' => $idBodega,
            'bodega' => $bodega->nombre,
            'egreso' => $datosBebidas,
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        DB::rollBack();

        Log::error($e->getMessage());

        return response()->json([
            'message' => 'Error al realizar el egreso de stock',
            'error' => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}



}