<?php

namespace App\Repositories;

use App\Models\Bebida;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

class BebidaRepository{


    public function createBebida($request){
        try{
            $bebida = new Bebida();
            $bebida->nombre = $request->nombre;
            $bebida->formato = $request->formato;
            $bebida->save();
            return response()->json([
                "message" => "Bebida creada correctamente",
                "data" => $bebida
            ], Response::HTTP_CREATED);
        } catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                "message" => "Error al crear bebida",
                "data" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


    public function viewAllBebidas($request){
        try{
            $bebidas = Bebida::all();
            return response()->json([
                "message" => "Bebidas obtenidas correctamente",
                "data" => $bebidas
            ], Response::HTTP_OK);
        } catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                "message" => "Error al obtener bebidas",
                "data" => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }


}