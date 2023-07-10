<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BebidaController;
use App\Http\Controllers\BodegaController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\TraspasoController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('/bebida')->group(function () {
    Route::post('/create', [BebidaController::class, 'createBebida']);
    Route::get('/viewAll', [BebidaController::class, 'viewAllBebidas']);
    Route::get('/view', [BebidaController::class, 'viewBebida']);
    Route::put('/update', [BebidaController::class, 'updateBebida']);
    Route::delete('/delete', [BebidaController::class, 'deleteBebida']);
});

Route::prefix('/bodega')->group(function () {
    Route::post('/create', [BodegaController::class, 'createBodega']);
    Route::get('/viewAll', [BodegaController::class, 'viewAllBodegas']);
    Route::get('/view', [BodegaController::class, 'viewBodega']);
    Route::put('/update', [BodegaController::class, 'updateBodega']);
    Route::delete('/delete', [BodegaController::class, 'deleteBodega']);
});

Route::prefix('/ingreso')->group(function () {
    Route::post('/create', [IngresoController::class, 'createIngreso']);
    Route::get('/view', [IngresoController::class, 'view']);
    Route::get('/viewAll', [IngresoController::class, 'viewAll']);
    Route::get('/viewPorBodega', [IngresoController::class, 'viewPorBodega']);
});

Route::prefix('/stock')->group(function () {
    Route::get('/viewAll', [StockController::class, 'viewAllStock']);
    Route::get('/view', [StockController::class, 'view']);
    Route::post('/egreso', [StockController::class, 'egreso']);
});

Route::prefix('/traspaso')->group(function () {
    Route::post('/traspasarStock', [TraspasoController::class, 'traspasarStock']);
});
