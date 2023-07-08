<?php

namespace App\Repositories;

use App\Models\Ingreso;
use App\Models\DetalleIngreso;
use App\Models\Stock;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class IngresoRepository{


    public function createIngreso($datosIngreso)
    {
        try {
            $ingreso = Ingreso::create([
                'id_bodega' => $datosIngreso['id_bodega'],
                'guia' => $datosIngreso['guia'],
            ]);
    
            foreach ($datosIngreso['detalles'] as $detalle) {
                DetalleIngreso::create([
                    'ingreso_id' => $ingreso->id,
                    'bebida_id' => $detalle['bebida_id'],
                    'cantidad' => $detalle['cantidad'],
                ]);
    
                // Actualizar o crear la entrada en la tabla stock
                $stock = Stock::updateOrCreate(
                    ['id_bodega' => $datosIngreso['id_bodega'], 'bebida_id' => $detalle['bebida_id']],
                    ['cantidad' => DB::raw('cantidad + ' . $detalle['cantidad'])]
                );
            }
    
            // Obtener el ingreso recién creado con sus detalles
            $ingreso->load('detalles.bebida');
    
            // Ocultar los campos id y ingreso_id en los detalles
            $ingreso->detalles->each(function ($detalle) {
                $detalle->makeHidden(['id', 'ingreso_id']);
            });
    
            // Agregar el nombre de la bodega como propiedad separada
            $ingreso->bodega_nombre = $ingreso->bodega->nombre;
    
            // Eliminar la relación 'bodega' original
            unset($ingreso->bodega);
    
            return [
                'message' => 'Ingreso realizado correctamente',
                'ingreso' => $ingreso,
                'status' => Response::HTTP_CREATED,
            ];
        } catch (QueryException $e) {
            // Error de consulta en la base de datos
            return [
                'message' => 'Error al realizar el ingreso',
                'error' => $e->getMessage(),
                'status' => Response::HTTP_BAD_REQUEST,
            ];
        } catch (Exception $e) {
            // Error general
            return [
                'message' => 'Error al realizar el ingreso',
                'error' => $e->getMessage(),
                'status' => Response::HTTP_INTERNAL_SERVER_ERROR,
            ];
        }
    }
    
    public function view($request)
    {
        try {
            $id = $request->input('id');
    
            $ingreso = Ingreso::with('detalles.bebida', 'bodega')->findOrFail($id);
    
            // Ocultar los campos id y ingreso_id en los detalles
            $ingreso->detalles->each(function ($detalle) {
                $detalle->makeHidden(['id', 'ingreso_id']);
            });
    
            // Agregar el nombre de la bodega como propiedad separada
            $ingreso->bodega_nombre = $ingreso->bodega->nombre;
    
            // Eliminar la relación 'bodega' original
            unset($ingreso->bodega);
    
            return response()->json([
                'message' => 'Ingreso encontrado correctamente',
                'ingreso' => $ingreso
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Ingreso no encontrado',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el ingreso',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    public function viewAll()
    {
        try {
            $ingresos = Ingreso::with('detalles.bebida', 'bodega')->get();
    
            $ingresos->each(function ($ingreso) {
                $ingreso->detalles->makeHidden(['id', 'ingreso_id']);
                // Agregar el nombre de la bodega como propiedad separada
                $ingreso->bodega_nombre = $ingreso->bodega->nombre;
                // Eliminar la relación 'bodega' original
                unset($ingreso->bodega);
            });
    
            return response()->json([
                'message' => 'Ingresos obtenidos correctamente',
                'ingresos' => $ingresos
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los ingresos',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

public function viewPorBodega($request)
{
    try {
        $idBodega = $request->input('id_bodega');

        $ingresos = Ingreso::where('id_bodega', $idBodega)
            ->with('detalles', 'bodega')
            ->get();

        $ingresos = $ingresos->map(function ($ingreso) {
            $ingreso->detalles->makeHidden(['id', 'ingreso_id']);
            $ingreso->bodega->makeHidden(['created_at', 'updated_at']);
            $ingreso->bodega_nombre = $ingreso->bodega->nombre;
            unset($ingreso->bodega);
            return $ingreso;
        });

        return response()->json([
            'message' => 'Ingresos obtenidos correctamente',
            'ingresos' => $ingresos
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Error al obtener los ingresos',
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

}