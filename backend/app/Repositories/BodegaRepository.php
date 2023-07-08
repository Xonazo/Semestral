<?php

namespace App\Repositories;

use App\Models\Bodega;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

class BodegaRepository{


    public function createBodega($request)
    {
        try {
            $bodega = new Bodega();
            $bodega->nombre = $request->nombre;
            $bodega->save();
            
            return response()->json([
                "message" => "Bodega creada correctamente",
                "data" => $bodega
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            
            return response()->json([
                "message" => "Error al crear bodega",
                "data" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    


    public function viewAllBodegas()
{
    try {
        $bodegas = Bodega::all();
        return response()->json([
            "message" => "Bodegas obtenidas correctamente",
            "data" => $bodegas
        ], Response::HTTP_OK);
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            "message" => "Error al obtener bodegas",
            "data" => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}


public function viewBodega($request)
{
    try {
        $id = $request->input('id');
        $bodega = Bodega::findOrFail($id);
        return response()->json([
            "message" => "Bodega obtenida correctamente",
            "data" => $bodega
        ], Response::HTTP_OK);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            "message" => "Bodega no encontrada",
            "data" => null
        ], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            "message" => "Error al obtener la bodega",
            "data" => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}


public function updateBodega($request)
{
    try {
        $id = $request->input('id');
        $bodega = Bodega::findOrFail($id);
        $bodega->update($request->all());
        return response()->json([
            "message" => "Bodega actualizada correctamente",
            "data" => $bodega
        ], Response::HTTP_OK);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            "message" => "Bodega no encontrada",
            "data" => null
        ], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            "message" => "Error al actualizar la bodega",
            "data" => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}


public function deleteBodega($request)
{
    try {
        $id = $request->input('id');
        $bodega = Bodega::findOrFail($id);
        $bodega->delete();
        
        return response()->json([
            "message" => "Bodega eliminada correctamente"
        ], Response::HTTP_OK);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            "message" => "Bodega no encontrada"
        ], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            "message" => "Error al eliminar la bodega",
            "data" => $e->getMessage()
        ], Response::HTTP_BAD_REQUEST);
    }
}



}