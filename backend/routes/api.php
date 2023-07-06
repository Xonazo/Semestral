<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BebidaController;

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